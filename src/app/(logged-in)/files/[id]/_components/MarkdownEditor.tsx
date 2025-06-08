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

import getCaretCoordinates from "textarea-caret"

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

  const sendOperation = useCallback(async (operation: Operation) => {
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
  }, [secretKeyForWorkspace]);

  const flushPendingUpdate = useCallback(async () => {
    if (pendingUpdateRef.current) {
      const operation = pendingUpdateRef.current;
      pendingUpdateRef.current = null;

      setPendingOperations(prev => [...prev, {
        operation,
        originalOperation: { ...operation }
      }]);

      await sendOperation(operation);
    }
  }, [sendOperation]);

  const handleTextChange = useCallback((newText: string, _: number) => {
    const currentText = content;

    if (newText === currentText) return;

    let operation: Operation | null = null;

    if (newText.length > currentText.length) {
      const insertPos = findInsertPosition(currentText, newText);
      const insertedContent = newText.substring(insertPos, insertPos + (newText.length - currentText.length));

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
        if (pendingUpdateRef.current.type === operation.type &&
            pendingUpdateRef.current.type === "insert" &&
            operation.type === "insert" &&
            pendingUpdateRef.current.position + pendingUpdateRef.current.content!.length === operation.position) {
          pendingUpdateRef.current.content += operation.content!;
        } else if (pendingUpdateRef.current.type === operation.type &&
            pendingUpdateRef.current.type === "delete" &&
            operation.type === "delete" &&
            operation.position + operation.length! === pendingUpdateRef.current.position) {
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
  }, [content, serverVersion, flushPendingUpdate]);

  const handleCursorChange = useCallback(async () => {
    if (!textAreaRef.current) return;

    const position = textAreaRef.current.selectionStart;
    const selectionEnd = textAreaRef.current.selectionEnd;
    console.log("Sending out cursor position", position);

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
      const result = await updateFileContent({ fileId, content: await encryptWithSymmetricKey(content, secretKeyForWorkspace) });
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

      setCursors(prevCursors => {
        const filteredCursors: { [key: string]: CursorPosition } = {};
        Object.keys(prevCursors).forEach((uid) => {
          if (message.usersList.includes(uid)) {
            filteredCursors[uid] = prevCursors[uid];
          }
        });
        return filteredCursors;
      });
    },
    "cursor": async (message: any) => {
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
    "content": async (message: any) => {
      try {
        const decryptedContent = (await decryptWithSymmetricKey(
            message.encryptedMessage,
            secretKeyForWorkspace
        )) as string;
        const { operation, clientId } = JSON.parse(decryptedContent);

        if (clientId === clientIdRef.current) {
          setPendingOperations(prev => {
            const acknowledgedOp = prev[0];
            if (acknowledgedOp) {
              setAcknowledgingOperations(ack => [...ack, acknowledgedOp]);
              return prev.slice(1);
            }
            return prev;
          });
          setServerVersion(message.version);
        } else {
          let transformedOp = { ...operation, version: message.version };

          setPendingOperations(currentPending => {
            currentPending.forEach(pending => {
              transformedOp = transformOperation(transformedOp, pending.operation);
              pending.operation = transformOperation(pending.operation, operation);
            });
            return currentPending;
          });

          setContent(prevContent => applyOperation(prevContent, transformedOp));
          setServerVersion(message.version);

          setCursors(prevCursors => {
            const newCursors = { ...prevCursors };
            Object.keys(newCursors).forEach(uid => {
              if (uid !== message.userId) {
                newCursors[uid] = {
                  ...newCursors[uid],
                  position: transformCursor(newCursors[uid].position, transformedOp),
                  selectionEnd: newCursors[uid].selectionEnd
                      ? transformCursor(newCursors[uid].selectionEnd, transformedOp)
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
            const newSelectionEnd = transformCursor(selectionEnd, transformedOp);

            requestAnimationFrame(() => {
              if (textAreaRef.current && !isComposingRef.current) {
                textAreaRef.current.setSelectionRange(newCursorPos, newSelectionEnd);
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
    }
  };

  const handleSocketMessage = useCallback(async (event: MessageEvent) => {
    try {
      const message: ReceivedMessage = JSON.parse(event.data);
      const handler = messageHandlers[message.type as keyof typeof messageHandlers];
      if (handler) {
        await handler(message);
      }
    } catch (error) {
      console.error("Failed to parse message:", error);
    }
  }, [userId, usernames, secretKeyForWorkspace]);

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
  }, [handleTextChange, handleCursorChange]);

  return (
      <div>
        {iAmLeader && (
            <div className="bg-green-500 text-white p-2 rounded-md mb-4">
              You are the leader of this file. Your changes will be automatically saved.
            </div>
        )}

        {Object.keys(usernames).length > 0 && (
            <div className="p-2 rounded-md mb-4">
              <h3 className="text-lg font-semibold">Active users:</h3>
              <div className="flex flex-wrap gap-3 py-2">
                {Object.entries(usernames).map(([uid, username]) => (
                    <div
                        key={uid}
                        className="text-white px-4 rounded-md py-1"
                        style={{ backgroundColor: stringToColor(uid) }}
                    >
                      {username}
                    </div>
                ))}
              </div>
            </div>
        )}

        <div className="relative">
        <textarea
            ref={textAreaRef}
            value={content}
            onChange={() => {}}
            className="w-full h-96 p-4 focus:outline-none bg-gray-900 font-mono"
            placeholder="Start typing your markdown content..."
            spellCheck={false}
        />

          {Object.entries(cursors).map(([uid, cursor]) => {
            if (uid === userId || !textAreaRef.current) return null;

            const {top, left} = getCaretCoordinates(textAreaRef.current, cursor.position);

            const cursorColor = stringToColor(uid);

            return (
                <div key={uid}>
                  <div
                      className="absolute pointer-events-none"
                      style={{
                        top: `${top}px`,
                        left: `${left}px`,
                        zIndex: 10,
                      }}
                  >
                    <div
                        className="absolute bottom-0 left-0 text-white text-xs px-2 py-0.5 rounded shadow-sm"
                        style={{
                          whiteSpace: "nowrap",
                          backgroundColor: cursorColor,
                          transform: "translateY(-100%)",
                        }}
                    >
                      {usernames[uid] || uid}
                    </div>
                    <div
                        className="w-0.5 h-5"
                        style={{
                          backgroundColor: cursorColor,
                          animation: "pulse 1.5s infinite",
                        }}
                    />
                  </div>

                  {cursor.selectionEnd && cursor.selectionEnd !== cursor.position && (
                      <div
                          className="absolute pointer-events-none"
                          style={{
                            top: `${top}px`,
                            left: `${left}px`,
                            height: `${parseInt(window.getComputedStyle(textAreaRef.current).lineHeight)}px`,
                            backgroundColor: cursorColor,
                            opacity: 0.3,
                            zIndex: 9,
                          }}
                      />
                  )}
                </div>
            );
          })}
        </div>
      </div>
  );
}