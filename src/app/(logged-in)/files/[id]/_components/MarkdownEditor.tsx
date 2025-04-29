import { useEffect, useRef, useState } from "react";
import {
  ContentSendMessage,
  CursorSendMessage,
  ReceivedMessage,
} from "../../../../../../websockets/types";
import { getUsernames } from "../_actions/getUsernames";
import {
  decryptWithSymmetricKey,
  encryptWithSymmetricKey,
} from "@/lib/cryptoClientSide";
import { parse } from "path";

interface CursorPosition {
  userId: string;
  position: number;
  timestamp: number;
}

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
  const previousLengthRef = useRef(0);
  const selectionRef = useRef({ start: 0, end: 0 });

  const handleBeforeInput = (e: any) => {
    const textarea = textAreaRef.current;
    if (textarea) {
      selectionRef.current = {
        start: textarea.selectionStart,
        end: textarea.selectionEnd,
      };
    }
  };

  const handleContentChange = async () => {
    if (!textAreaRef.current) return;
    const newContent = textAreaRef.current.value;
    const cursorPosition = textAreaRef.current.selectionStart || 0;

    const { start, end } = selectionRef.current;
    console.log(start, end, "start and end");
    const replacedLength = end - start;
    const insertedText = newContent.substring(start, cursorPosition);

    if (replacedLength > 0) {
      const message = {
        type: "replace",
        position: start,
        replacedLength,
        content: insertedText,
      };

      const encryptedMessage = await encryptWithSymmetricKey(
        JSON.stringify(message),
        secretKeyForWorkspace
      );

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "content",
            encryptedMessage,
          } as ContentSendMessage)
        );
      }
    } else if (newContent.length > previousLengthRef.current) {
      const insertionPosition =
        cursorPosition - (newContent.length - previousLengthRef.current);

      const message = {
        type: "insert",
        position: insertionPosition,
        content: newContent.substring(insertionPosition, cursorPosition),
      };

      if (textAreaRef.current) textAreaRef.current.value = newContent;

      const encryptedMessage = await encryptWithSymmetricKey(
        JSON.stringify(message),
        secretKeyForWorkspace
      );

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "content",
            encryptedMessage,
          } as ContentSendMessage)
        );
      }
    } else if (newContent.length < previousLengthRef.current) {
      const deletionPosition = cursorPosition;
      const deletionLength = previousLengthRef.current - newContent.length;

      const message = {
        type: "delete",
        position: deletionPosition,
        length: deletionLength,
      };

      if (textAreaRef.current) textAreaRef.current.value = newContent;

      const encryptedMessage = await encryptWithSymmetricKey(
        JSON.stringify(message),
        secretKeyForWorkspace
      );

      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.send(
          JSON.stringify({
            type: "content",
            encryptedMessage,
          } as ContentSendMessage)
        );
      }
    }
    previousLengthRef.current = newContent.length; // Update previousLength
    handleCursorChange();
  };

  const calculateCursorCoordinates = (position: number) => {
    if (!textAreaRef.current) return { top: 0, left: 0 };

    const textarea = textAreaRef.current;
    const style = window.getComputedStyle(textarea);
    const text = textarea.value;

    const mirror = document.createElement("div");

    // Mirror styling
    mirror.style.position = "absolute";
    mirror.style.top = "0";
    mirror.style.left = "-9999px";
    mirror.style.whiteSpace = "pre-wrap";
    mirror.style.wordWrap = "break-word";
    mirror.style.overflowWrap = "break-word";
    mirror.style.visibility = "hidden";

    // Copy styles that affect layout
    const properties = [
      "fontFamily",
      "fontSize",
      "fontWeight",
      "fontStyle",
      "letterSpacing",
      "textTransform",
      "wordSpacing",
      "textIndent",
      "boxSizing",
      "borderLeftWidth",
      "borderRightWidth",
      "borderTopWidth",
      "borderBottomWidth",
      "paddingTop",
      "paddingRight",
      "paddingBottom",
      "paddingLeft",
      "lineHeight",
      "width",
    ];
    properties.forEach((prop) => {
      mirror.style[prop as any] = style[prop as any];
    });

    // Copy text before cursor
    const textBefore = document.createTextNode(text.substring(0, position));
    const marker = document.createElement("span");
    marker.textContent = "\u200b"; // zero-width space for measurement
    mirror.appendChild(textBefore);
    mirror.appendChild(marker);

    document.body.appendChild(mirror);
    const markerRect = marker.getBoundingClientRect();
    const mirrorRect = mirror.getBoundingClientRect();
    document.body.removeChild(mirror);

    const top = markerRect.top - mirrorRect.top - textarea.scrollTop;
    const left = markerRect.left - mirrorRect.left - textarea.scrollLeft;

    return { top, left };
  };

  // Handle cursor position changes
  const handleCursorChange = async () => {
    if (!textAreaRef.current) return;

    const position = textAreaRef.current.selectionStart;
    const cursorData = {
      position,
      timestamp: Date.now(),
    };

    // Only send if socket is connected
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
  };

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.value = fileContent;
      previousLengthRef.current = fileContent.length;
    }
  }, [textAreaRef]);

  useEffect(() => {
    // TODO: if user is leader then update the file in db with some interval
  }, [iAmLeader]);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const socket = new WebSocket(
      `${protocol}//${window.location.host}/api/websocket?fileId=${fileId}`
    );
    socketRef.current = socket;

    socket.addEventListener("open", () => {
      socket.addEventListener("message", async (event) => {
        try {
          const message: ReceivedMessage = JSON.parse(event.data);
          if (message.type === "you-are-leader") {
            setIAmLeader(true);
          } else if (message.type === "users-list") {
            const newUsernames: { [key: string]: string } = {};

            const userIdsThatNeedToBeFetched = message.usersList.filter(
              (userId) => !usernames[userId]
            );
            message.usersList.forEach((userId) => {
              newUsernames[userId] = usernames[userId] || userId;
            });

            if (userIdsThatNeedToBeFetched.length > 0) {
              const res = await getUsernames({
                userIds: userIdsThatNeedToBeFetched,
              });
              if (res.success) {
                res.data.forEach((user) => {
                  newUsernames[user.id] = user.username;
                });
              }
            }

            const filteredCursors: { [key: string]: CursorPosition } = {};
            Object.keys(cursors).forEach((userId) => {
              if (message.usersList.includes(userId)) {
                filteredCursors[userId] = cursors[userId];
              }
            });
            setCursors(filteredCursors);
            setUsernames(newUsernames);
          } else if (message.type === "cursor") {
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
                    timestamp: cursorData.timestamp,
                  },
                }));
              } catch (error) {
                console.error("Failed to decrypt cursor message:", error);
              }
            }
          } else if (message.type === "content") {
            if (message.userId !== userId) {
              try {
                const decryptedContent = (await decryptWithSymmetricKey(
                  message.encryptedMessage,
                  secretKeyForWorkspace
                )) as string;
                const parsedContent = JSON.parse(decryptedContent);
                if (parsedContent.type === "insert") {
                  if (textAreaRef.current) {
                    const textarea = textAreaRef.current;
                    const currentContent = textarea.value;
                    const cursorPosition = textarea.selectionStart;

                    // Calculate the new content
                    const newContent =
                      currentContent.slice(0, parsedContent.position) +
                      parsedContent.content +
                      currentContent.slice(parsedContent.position);

                    // Calculate new cursor position
                    let newCursorPosition = cursorPosition;
                    if (parsedContent.position <= cursorPosition) {
                      newCursorPosition =
                        cursorPosition + parsedContent.content.length;
                    }

                    // Update the textarea value directly
                    textAreaRef.current.value = newContent;

                    // Restore cursor position
                    textarea.focus();
                    textarea.setSelectionRange(
                      newCursorPosition,
                      newCursorPosition
                    );

                    handleCursorChange();
                  }
                } else if (parsedContent.type === "delete") {
                  if (textAreaRef.current) {
                    const textarea = textAreaRef.current;
                    const currentContent = textarea.value;
                    const cursorPosition = textarea.selectionStart;

                    // Calculate the new content after deletion
                    const newContent =
                      currentContent.slice(0, parsedContent.position) +
                      currentContent.slice(
                        parsedContent.position + parsedContent.length
                      );

                    // Calculate new cursor position
                    let newCursorPosition = cursorPosition;
                    if (parsedContent.position < cursorPosition) {
                      // If deletion happens before cursor, adjust cursor position
                      newCursorPosition = Math.max(
                        parsedContent.position,
                        cursorPosition - parsedContent.length
                      );
                    }

                    // Update the textarea value directly
                    textAreaRef.current.value = newContent;

                    // Restore cursor position
                    textarea.focus();
                    textarea.setSelectionRange(
                      newCursorPosition,
                      newCursorPosition
                    );

                    handleCursorChange();
                  }
                } else if (parsedContent.type === "replace") {
                  if (textAreaRef.current) {
                    const textarea = textAreaRef.current;
                    const currentContent = textarea.value;
                    const cursorPosition = textarea.selectionStart;

                    // Calculate the new content
                    const newContent =
                      currentContent.slice(0, parsedContent.position) +
                      parsedContent.content +
                      currentContent.slice(
                        parsedContent.position + parsedContent.replacedLength
                      );

                    // Calculate new cursor position
                    let newCursorPosition = cursorPosition;
                    if (parsedContent.position <= cursorPosition) {
                      newCursorPosition =
                        cursorPosition +
                        parsedContent.content.length -
                        parsedContent.replacedLength;
                    }

                    // Update the textarea value directly
                    textAreaRef.current.value = newContent;

                    // Restore cursor position
                    textarea.focus();
                    textarea.setSelectionRange(
                      newCursorPosition,
                      newCursorPosition
                    );

                    handleCursorChange();
                  }
                }
              } catch (error) {
                console.error("Failed to decrypt content message:", error);
              }
            }
          }
        } catch (error) {
          console.error("Failed to parse message:", error);
        }
      });
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    socket.addEventListener("close", () => {
      console.log("WebSocket connection closed");
    });

    return () => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  // Set up event listeners for cursor tracking
  useEffect(() => {
    const textarea = textAreaRef.current;
    if (!textarea) return;

    // Track cursor positions
    textarea.addEventListener("click", handleCursorChange);
    textarea.addEventListener("keyup", handleCursorChange);
    textarea.addEventListener("focus", handleCursorChange);

    return () => {
      textarea.removeEventListener("click", handleCursorChange);
      textarea.removeEventListener("keyup", handleCursorChange);
      textarea.removeEventListener("focus", handleCursorChange);
    };
  }, []);

  //   useEffect(() => {
  //     const interval = setInterval(() => {
  //       const now = Date.now();
  //       setCursors((prevCursors) => {
  //         const newCursors = { ...prevCursors };
  //         let hasChanged = false;

  //         Object.entries(newCursors).forEach(([key, cursor]) => {
  //           if (now - cursor.timestamp > 10000) {
  //             // 10 seconds
  //             delete newCursors[key];
  //             hasChanged = true;
  //           }
  //         });

  //         return hasChanged ? newCursors : prevCursors;
  //       });
  //     }, 5000); // Check every 5 seconds

  //     return () => clearInterval(interval);
  //   }, []);

  const stringToColor = (str: string) => {
    let hash = 60;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 90%, 35%)`;
  };

  return (
    <div>
      <div>
        {iAmLeader && (
          <div className="bg-green-500 text-white p-2 rounded-md mb-4">
            You are the leader of this file. So you will automatically save file
            to db.
          </div>
        )}
      </div>
      {/* show usernames who is joiuned */}
      {Object.keys(usernames).length > 0 && (
        <div className=" p-2 rounded-md mb-4">
          <h3 className="text-lg font-semibold">Users in the room:</h3>
          <div className="list-disc flex flex-wrap gap-3 py-2">
            {Object.keys(usernames).map((userId) => {
              return (
                <div
                  key={userId}
                  className="text-white px-4 rounded-md py-1"
                  style={{
                    backgroundColor: stringToColor(userId),
                  }}
                >
                  {usernames[userId]} : {cursors[userId]?.position || 0}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="relative">
        <textarea
          ref={textAreaRef}
          //   value={content}
          onBeforeInput={handleBeforeInput}
          onChange={handleContentChange}
          className="w-full h-96 p-4 focus:outline-none bg-gray-900"
          placeholder="Start typing your markdown content..."
        />

        {/* Render other users' cursors */}
        {Object.values(cursors).map((cursor) => {
          if (!textAreaRef.current) return null;

          // Calculate visual position
          const { top, left } = calculateCursorCoordinates(cursor.position);

          // Only show cursors that are within the visible area
          const isVisible =
            top >= 0 &&
            left >= 0 &&
            top <= textAreaRef.current.clientHeight &&
            left <= textAreaRef.current.clientWidth;

          if (!isVisible) return null;

          // Generate a stable but unique color for each user

          const cursorColor = stringToColor(cursor.userId);

          return (
            <div
              key={cursor.userId}
              className="absolute pointer-events-none"
              style={{
                top: `${top}px`,
                left: `${left}px`,
                zIndex: 10,
              }}
            >
              {/* Username label */}
              <div
                className="absolute bottom-0 left-0 text-white  px-2 py-0.5 rounded shadow-sm"
                style={{
                  whiteSpace: "nowrap",
                  backgroundColor: cursorColor,
                  transform: "translateY(-100%)",
                }}
              >
                {usernames[cursor.userId] || cursor.userId}
              </div>

              {/* Cursor line */}
              <div
                className="w-0.5 h-5 animate-pulse"
                style={{
                  backgroundColor: cursorColor,
                  animation: "pulse 1.5s infinite",
                }}
              ></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
