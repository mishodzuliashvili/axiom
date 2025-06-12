import { useEffect, useRef, useState, useCallback } from "react";
import {
  ContentSendMessage,
  CursorSendMessage,
  ReceivedMessage,
} from "../../../../../../websockets/types";
import { getUsernames } from "../_actions/getUsernames";
import { updateFileContent } from "../_actions/documentActions";
import {
  decryptWithSymmetricKey,
  encryptWithSymmetricKey,
} from "@/lib/cryptoClientSide";
import { MarkdownHooks } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import getCaretCoordinates from "textarea-caret";
import rehypeStarryNight from "rehype-starry-night";
import { Edit, Eye, Maximize2, Settings, Split, Users } from "lucide-react";

interface CursorPosition {
  userId: string;
  position: number;
  timestamp: number;
  selectionEnd?: number;
}

interface Operation {
  type: "insert" | "delete";
  position: number;
  content?: string;
  length?: number;
  clientId: string;
  version: number;
}

interface PendingOperation {
  operation: Operation;
  originalOperation: Operation;
}

const stringToColor = (str: string) => {
  let hash = 60;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = hash % 360;
  return `hsl(${hue}, 90%, 35%)`;
};

const transformStrategies = {
  "insert-insert": (op1: Operation, op2: Operation) => {
    if (op1.position < op2.position || (op1.position === op2.position && op1.clientId < op2.clientId)) {
      return { ...op1 };
    } else {
      return { ...op1, position: op1.position + (op2.content?.length || 0) };
    }
  },
  "insert-delete": (op1: Operation, op2: Operation) => {
    if (op1.position <= op2.position) {
      return { ...op1 };
    } else if (op1.position > op2.position + (op2.length || 0)) {
      return { ...op1, position: op1.position - (op2.length || 0) };
    } else {
      return { ...op1, position: op2.position };
    }
  },
  "delete-insert": (op1: Operation, op2: Operation) => {
    if (op1.position < op2.position) {
      return { ...op1 };
    } else {
      return { ...op1, position: op1.position + (op2.content?.length || 0) };
    }
  },
  "delete-delete": (op1: Operation, op2: Operation) => {
    if (op1.position < op2.position) {
      return { ...op1 };
    } else if (op1.position >= op2.position + (op2.length || 0)) {
      return { ...op1, position: op1.position - (op2.length || 0) };
    } else {
      const newPosition = op2.position;
      const overlap = Math.min(
          op1.position + (op1.length || 0),
          op2.position + (op2.length || 0)
      ) - op1.position;
      return { ...op1, position: newPosition, length: (op1.length || 0) - overlap };
    }
  }
};

const transformOperation = (op1: Operation, op2: Operation): Operation => {
  const key = `${op1.type}-${op2.type}` as keyof typeof transformStrategies;
  return transformStrategies[key](op1, op2);
};

const cursorTransformStrategies = {
  insert: (cursor: number, op: Operation) => {
    if (cursor <= op.position) {
      return cursor;
    } else {
      return cursor + (op.content?.length || 0);
    }
  },
  delete: (cursor: number, op: Operation) => {
    if (cursor <= op.position) {
      return cursor;
    } else if (cursor > op.position + (op.length || 0)) {
      return cursor - (op.length || 0);
    } else {
      return op.position;
    }
  }
};

const transformCursor = (cursor: number, op: Operation): number => {
  return cursorTransformStrategies[op.type](cursor, op);
};

const operationAppliers = {
  insert: (text: string, op: Operation) =>
      text.slice(0, op.position) + (op.content || "") + text.slice(op.position),
  delete: (text: string, op: Operation) =>
      text.slice(0, op.position) + text.slice(op.position + (op.length || 0))
};

const applyOperation = (text: string, op: Operation): string => {
  return operationAppliers[op.type](text, op);
};

const findInsertPosition = (oldText: string, newText: string): number => {
  let i = 0;
  while (i < oldText.length && oldText[i] === newText[i]) i++;
  return i;
};

const findDeletePosition = (oldText: string, newText: string): number => {
  let i = 0;
  while (i < newText.length && oldText[i] === newText[i]) i++;
  return i;
};

export default function MarkdownEditor({
  userId,
  fileId,
  fileContent,
  secretKeyForWorkspace,
}: {
  userId: string;
  fileId: string;
  fileContent: string;
  secretKeyForWorkspace: string;
}) {
  const socketRef = useRef<WebSocket | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [iAmLeader, setIAmLeader] = useState(false);
  const [usernames, setUsernames] = useState<{ [key: string]: string }>({});
  const [cursors, setCursors] = useState<{ [key: string]: CursorPosition }>({});

  const [content, setContent] = useState(fileContent);
  const [serverVersion, setServerVersion] = useState(0);
  const [pendingOperations, setPendingOperations] = useState<PendingOperation[]>([]);
  const [acknowledgingOperations, setAcknowledgingOperations] = useState<PendingOperation[]>([]);

  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingUpdateRef = useRef<Operation | null>(null);
  const lastSavedContentRef = useRef(fileContent);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const clientIdRef = useRef(`${userId}-${Date.now()}`);
  const isComposingRef = useRef(false);

  const [viewMode, setViewMode] = useState("split");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const sendOperation = useCallback(
      async (operation: Operation) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
          const message = {
            operation,
            clientId: clientIdRef.current,
          };

          const encryptedMessage = await encryptWithSymmetricKey(
              JSON.stringify(message),
              secretKeyForWorkspace
          );

          socketRef.current.send(
              JSON.stringify({
                type: "content",
                encryptedMessage,
              } as ContentSendMessage)
          );
        }
      },
      [secretKeyForWorkspace]
  );

  const flushPendingUpdate = useCallback(async () => {
    if (pendingUpdateRef.current) {
      const operation = pendingUpdateRef.current;
      pendingUpdateRef.current = null;

      setPendingOperations((prev) => [
        ...prev,
        {
          operation,
          originalOperation: { ...operation },
        },
      ]);

      await sendOperation(operation);
    }
  }, [sendOperation]);

  const handleTextChange = useCallback(
      (newText: string, _: number) => {
        const currentText = content;

        if (newText === currentText) return;

        let operation: Operation | null = null;

        if (newText.length > currentText.length) {
          const insertPos = findInsertPosition(currentText, newText);
          const insertedContent = newText.substring(
              insertPos,
              insertPos + (newText.length - currentText.length)
          );

          operation = {
            type: "insert",
            position: insertPos,
            content: insertedContent,
            clientId: clientIdRef.current,
            version: serverVersion,
          };
        } else if (newText.length < currentText.length) {
          const deletePos = findDeletePosition(currentText, newText);

          operation = {
            type: "delete",
            position: deletePos,
            length: currentText.length - newText.length,
            clientId: clientIdRef.current,
            version: serverVersion,
          };
        }

        if (operation) {
          setContent(newText);

          if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
          }

          if (pendingUpdateRef.current) {
            if (
                pendingUpdateRef.current.type === operation.type &&
                pendingUpdateRef.current.type === "insert" &&
                operation.type === "insert" &&
                pendingUpdateRef.current.position +
                pendingUpdateRef.current.content!.length ===
                operation.position
            ) {
              pendingUpdateRef.current.content += operation.content!;
            } else if (
                pendingUpdateRef.current.type === operation.type &&
                pendingUpdateRef.current.type === "delete" &&
                operation.type === "delete" &&
                operation.position + operation.length! ===
                pendingUpdateRef.current.position
            ) {
              pendingUpdateRef.current.position = operation.position;
              pendingUpdateRef.current.length! += operation.length!;
            } else {
              void flushPendingUpdate();
              pendingUpdateRef.current = operation;
            }
          } else {
            pendingUpdateRef.current = operation;
          }

          updateTimeoutRef.current = setTimeout(() => {
            void flushPendingUpdate();
          }, 100);
        }
      },
      [content, serverVersion, flushPendingUpdate]
  );

  const handleCursorChange = useCallback(async () => {
    if (!textAreaRef.current) return;

    const position = textAreaRef.current.selectionStart;
    const selectionEnd = textAreaRef.current.selectionEnd;

    const cursorData = {
      position,
      selectionEnd: selectionEnd !== position ? selectionEnd : undefined,
      timestamp: Date.now(),
    };

    if (socketRef.current?.readyState === WebSocket.OPEN) {
      const encryptedMessage = await encryptWithSymmetricKey(
          JSON.stringify(cursorData),
          secretKeyForWorkspace
      );
      socketRef.current.send(
          JSON.stringify({
            type: "cursor",
            encryptedMessage,
          } as CursorSendMessage)
      );
    }
  }, [secretKeyForWorkspace]);

  const saveToDatabase = useCallback(async () => {
    if (!iAmLeader || content === lastSavedContentRef.current) return;

    try {
      const result = await updateFileContent({
        fileId,
        content: await encryptWithSymmetricKey(content, secretKeyForWorkspace),
      });
      if (result.success) {
        console.log("File saved successfully");
        lastSavedContentRef.current = content;
      } else {
        console.error("Failed to save file:", result.error);
      }
    } catch (error) {
      console.error("Error saving file:", error);
    }
  }, [iAmLeader, content, fileId, secretKeyForWorkspace]);

  useEffect(() => {
    setContent(fileContent);
    lastSavedContentRef.current = fileContent;
  }, [fileContent]);

  useEffect(() => {
    if (iAmLeader && content !== lastSavedContentRef.current) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        void saveToDatabase();
      }, 3000);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [content, iAmLeader, saveToDatabase]);

  const messageHandlers = {
    "you-are-leader": () => {
      setIAmLeader(true);
    },
    "users-list": async (message: any) => {
      const currentUsernames = await (async () => {
        const stored: { [key: string]: string } = {};
        const newUserIdsThatNeedToBeFetched = message.usersList.filter(
            (uid: string) => !usernames[uid]
        );

        message.usersList.forEach((uid: string) => {
          stored[uid] = usernames[uid] || uid;
        });

        if (newUserIdsThatNeedToBeFetched.length > 0) {
          const res = await getUsernames({
            userIds: newUserIdsThatNeedToBeFetched,
          });
          if (res.success) {
            res.data.forEach((user) => {
              stored[user.id] = user.username;
            });
          }
        }
        return stored;
      })();

      setUsernames(currentUsernames);

      setCursors((prevCursors) => {
        const filteredCursors: { [key: string]: CursorPosition } = {};
        Object.keys(prevCursors).forEach((uid) => {
          if (message.usersList.includes(uid)) {
            filteredCursors[uid] = prevCursors[uid];
          }
        });
        return filteredCursors;
      });
    },
    cursor: async (message: any) => {
      if (message.userId !== userId) {
        try {
          const decryptedData = (await decryptWithSymmetricKey(
              message.encryptedMessage,
              secretKeyForWorkspace
          )) as string;
          const cursorData = JSON.parse(decryptedData);

          setCursors((prevCursors) => ({
            ...prevCursors,
            [message.userId]: {
              userId: message.userId,
              position: cursorData.position,
              selectionEnd: cursorData.selectionEnd,
              timestamp: cursorData.timestamp,
            },
          }));
        } catch (error) {
          console.error("Failed to decrypt cursor message:", error);
        }
      }
    },
    content: async (message: any) => {
      try {
        const decryptedContent = (await decryptWithSymmetricKey(
            message.encryptedMessage,
            secretKeyForWorkspace
        )) as string;
        const { operation, clientId } = JSON.parse(decryptedContent);

        if (clientId === clientIdRef.current) {
          setPendingOperations((prev) => {
            const acknowledgedOp = prev[0];
            if (acknowledgedOp) {
              setAcknowledgingOperations((ack) => [...ack, acknowledgedOp]);
              return prev.slice(1);
            }
            return prev;
          });
          setServerVersion(message.version);
        } else {
          let transformedOp = { ...operation, version: message.version };

          setPendingOperations((currentPending) => {
            currentPending.forEach((pending) => {
              transformedOp = transformOperation(
                  transformedOp,
                  pending.operation
              );
              pending.operation = transformOperation(
                  pending.operation,
                  operation
              );
            });
            return currentPending;
          });

          setContent((prevContent) =>
              applyOperation(prevContent, transformedOp)
          );
          setServerVersion(message.version);

          setCursors((prevCursors) => {
            const newCursors = { ...prevCursors };
            Object.keys(newCursors).forEach((uid) => {
              if (uid !== message.userId) {
                newCursors[uid] = {
                  ...newCursors[uid],
                  position: transformCursor(
                      newCursors[uid].position,
                      transformedOp
                  ),
                  selectionEnd: newCursors[uid].selectionEnd
                      ? transformCursor(
                          newCursors[uid].selectionEnd,
                          transformedOp
                      )
                      : undefined,
                };
              }
            });
            return newCursors;
          });

          if (textAreaRef.current && !isComposingRef.current) {
            const cursorPos = textAreaRef.current.selectionStart;
            const selectionEnd = textAreaRef.current.selectionEnd;
            const newCursorPos = transformCursor(cursorPos, transformedOp);
            const newSelectionEnd = transformCursor(
                selectionEnd,
                transformedOp
            );

            requestAnimationFrame(() => {
              if (textAreaRef.current && !isComposingRef.current) {
                textAreaRef.current.setSelectionRange(
                    newCursorPos,
                    newSelectionEnd
                );
              }
            });
          }

          if (iAmLeader) {
            if (saveTimeoutRef.current) {
              clearTimeout(saveTimeoutRef.current);
            }
            saveTimeoutRef.current = setTimeout(() => {
              saveToDatabase();
            }, 3000);
          }
        }
      } catch (error) {
        console.error("Failed to decrypt content message:", error);
      }
    },
  };

  const handleSocketMessage = useCallback(
      async (event: MessageEvent) => {
        try {
          const message: ReceivedMessage = JSON.parse(event.data);
          const handler =
              messageHandlers[message.type as keyof typeof messageHandlers];
          if (handler) {
            await handler(message);
          }
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      },
      [userId, usernames, secretKeyForWorkspace]
  );

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(
        `${protocol}//${window.location.host}/api/websocket?fileId=${fileId}`
    );
    socketRef.current = socket;

    const handleOpen = () => {
      console.log("WebSocket connection opened");
    };

    const handleError = (error: Event) => {
      console.error("WebSocket error:", error);
    };

    const handleClose = () => {
      console.log("WebSocket connection closed");
      if (iAmLeader && content !== lastSavedContentRef.current) {
        void saveToDatabase();
      }
    };

    socket.addEventListener("open", handleOpen);
    socket.addEventListener("message", handleSocketMessage);
    socket.addEventListener("error", handleError);
    socket.addEventListener("close", handleClose);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      void flushPendingUpdate();

      socket.removeEventListener("open", handleOpen);
      socket.removeEventListener("message", handleSocketMessage);
      socket.removeEventListener("error", handleError);
      socket.removeEventListener("close", handleClose);

      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    const handleInput = (e: Event) => {
      const target = e.target as HTMLTextAreaElement;
      handleTextChange(target.value, target.selectionStart || 0);
    };

    const handleCompositionStart = () => {
      isComposingRef.current = true;
    };

    const handleCompositionEnd = (e: CompositionEvent) => {
      isComposingRef.current = false;
      const target = e.target as HTMLTextAreaElement;
      handleTextChange(target.value, target.selectionStart || 0);
    };

    textarea.addEventListener("input", handleInput);
    textarea.addEventListener("compositionstart", handleCompositionStart);
    textarea.addEventListener("compositionend", handleCompositionEnd);
    textarea.addEventListener("click", handleCursorChange);
    textarea.addEventListener("keyup", handleCursorChange);
    textarea.addEventListener("focus", handleCursorChange);
    textarea.addEventListener("select", handleCursorChange);

    return () => {
      textarea.removeEventListener("input", handleInput);
      textarea.removeEventListener("compositionstart", handleCompositionStart);
      textarea.removeEventListener("compositionend", handleCompositionEnd);
      textarea.removeEventListener("click", handleCursorChange);
      textarea.removeEventListener("keyup", handleCursorChange);
      textarea.removeEventListener("focus", handleCursorChange);
      textarea.removeEventListener("select", handleCursorChange);
    };
  }, [handleTextChange, handleCursorChange, viewMode]); // view mode change causes textarea ref to change

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height =
          textAreaRef.current.scrollHeight + "px";
    }
  }, [content, viewMode]); // view mode change causes textarea ref to change

  useEffect(() => {
    console.log('cursors', cursors);
  }, [cursors]);

  return (
      <div
          className={` bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900 ${
              isFullscreen ? "fixed inset-0 z-[100]" : ""
          }`}
      >
        <div className="container mx-auto p-4  h-full ">
          {/* Header */}
          <div className="mb-6">
            {Object.keys(usernames).length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 p-4 rounded-lg mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <h3 className="text-sm font-semibold text-gray-300">
                        Active collaborators
                      </h3>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                          onClick={() => setShowSettings(!showSettings)}
                          className="p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                      </button>
                      <button
                          onClick={() => setIsFullscreen(!isFullscreen)}
                          className="p-1.5 rounded-md bg-gray-700/50 hover:bg-gray-700 text-gray-400 hover:text-gray-300 transition-colors"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {Object.entries(usernames).map(([uid, username]) => (
                        <div
                            key={uid}
                            className="px-3 py-1.5 rounded-full text-xs font-medium text-white backdrop-blur-sm border border-white/20"
                            style={{
                              backgroundColor: `${stringToColor(uid)}40`,
                              borderColor: `${stringToColor(uid)}60`,
                            }}
                        >
                          <div
                              className="w-2 h-2 rounded-full mr-2 inline-block"
                              style={{ backgroundColor: stringToColor(uid) }}
                          ></div>
                          {username}
                        </div>
                    ))}
                  </div>
                </div>
            )}

            {/* Toolbar */}
            <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <button
                      onClick={() => setViewMode("editor")}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          viewMode === "editor"
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                      }`}
                  >
                    <Edit className="h-3 w-3 mr-1.5" />
                    Edit
                  </button>
                  <button
                      onClick={() => setViewMode("split")}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          viewMode === "split"
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                      }`}
                  >
                    <Split className="h-3 w-3 mr-1.5" />
                    Split
                  </button>
                  <button
                      onClick={() => setViewMode("preview")}
                      className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                          viewMode === "preview"
                              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                      }`}
                  >
                    <Eye className="h-3 w-3 mr-1.5" />
                    Preview
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="flex items-center text-xs text-green-400">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                    Auto-saved
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Editor Container */}
          <div
              className={`relative bg-gray-800/30 backdrop-blur-sm border border-gray-700/50 rounded-xl overflow-hidden shadow-2xl ${
                  isFullscreen ? "h-[calc(100vh-18rem)]" : "h-[65vh]"
              }`}
          >
            <div
                className={`flex h-full ${
                    viewMode === "split" ? "divide-x divide-gray-700/50" : ""
                }`}
            >
              {/* Editor Panel */}
              {(viewMode === "editor" || viewMode === "split") && (
                  <div
                      className={`${
                          viewMode === "split" ? "w-1/2" : "w-full"
                      } bg-gray-900/50 overflow-auto`}
                  >
                    <div className={`relative`}>
                  <textarea
                      ref={textAreaRef}
                      value={content}
                      onChange={() => {}}
                      className="w-full p-6 bg-transparent text-gray-100 font-mono text-sm leading-relaxed resize-none focus:outline-none placeholder-gray-500 selection:bg-blue-500/30 overflow-hidden"
                      placeholder="# Start typing your markdown content...\n\nUse **bold**, *italic*, and other markdown syntax."
                      spellCheck={false}
                      style={{ minHeight: "100%" }}
                  />
                      {/* Collaborative cursors */}
                      {Object.entries(cursors).map(([uid, cursor]) => {
                        if (uid === userId || !textAreaRef.current) return null;

                        const { top, left } = getCaretCoordinates(
                            textAreaRef.current,
                            cursor.position
                        );
                        const cursorColor = stringToColor(uid);

                        return (
                            <div key={uid}>
                              <div
                                  className="absolute pointer-events-none z-20"
                                  style={{
                                    top: `${top}px`,
                                    left: `${left}px`,
                                  }}
                              >
                                <div
                                    className="absolute bottom-0 left-0 text-white text-xs px-2 py-1 rounded-md shadow-lg backdrop-blur-sm"
                                    style={{
                                      whiteSpace: "nowrap",
                                      backgroundColor: cursorColor,
                                      transform: "translateY(-100%)",
                                    }}
                                >
                                  {usernames[uid] || uid}
                                </div>
                                <div
                                    className="w-0.5 h-6"
                                    style={{
                                      backgroundColor: cursorColor,
                                      animation: "pulse 1.5s infinite",
                                    }}
                                />
                              </div>

                              {cursor.selectionEnd &&
                                  cursor.selectionEnd !== cursor.position && (
                                      <div
                                          className="absolute pointer-events-none z-10"
                                          style={{
                                            top: `${top}px`,
                                            left: `${left}px`,
                                            height: `${parseInt(
                                                window.getComputedStyle(textAreaRef.current)
                                                    .lineHeight
                                            )}px`,
                                            backgroundColor: cursorColor,
                                            opacity: 0.2,
                                          }}
                                      />
                                  )}
                            </div>
                        );
                      })}
                    </div>
                  </div>
              )}

              {/* Preview Panel */}
              {(viewMode === "preview" || viewMode === "split") && (
                  <div
                      className={`${
                          viewMode === "split" ? "w-1/2" : "w-full"
                      } bg-gray-800/30 overflow-auto prose-gray prose prose prose-lg prose-gray prose-headings:text-white prose-p:text-gray-200 prose-strong:text-white prose-em:text-gray-300 prose-a:text-blue-400 prose-code:text-pink-400 prose-code:bg-gray-800 prose-pre:bg-gray-800 prose-pre:text-gray-200 prose-blockquote:text-gray-300 prose-blockquote:border-blue-500 prose-ul:text-gray-200 prose-ol:text-gray-200 prose-li:text-gray-200 prose-table:text-gray-200 prose-th:text-white prose-td:text-gray-200 prose-hr:border-gray-600 max-w-none p-6`}
                  >
                    <MarkdownHooks
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeSanitize, rehypeStarryNight]}
                    >
                      {content}
                    </MarkdownHooks>
                  </div>
              )}
            </div>
          </div>

          {/* Status Bar */}
          <div className="mt-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-4 text-gray-400">
                <span>Lines: {content.split("\n").length}</span>
                <span>Words: {content.split(/\s+/).filter((w) => w).length}</span>
                <span>Characters: {content.length}</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-400">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></div>
                  Encrypted
                </div>
                <span>•</span>
                <span>Markdown</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}
