// Broadcastet to all users in the room
export type UsersListReceivedMessage = {
  type: "users-list";
  fileId: string;
  usersList: string[];
};

// Sended to the user who is the leader of the room
export type LeaderReceivedMessage = {
  type: "you-are-leader";
  fileId: string;
};

export type ContentReceivedMessage = {
  type: "content";
  fileId: string;
  userId: string;
  encryptedMessage: string;
  time: string; // ISO format string
  version: number;
};

export type CursorReceivedMessage = {
  type: "cursor";
  fileId: string;
  userId: string;
  encryptedMessage: string;
  time: string; // ISO format string
};

export type ContentSendMessage = {
  type: "content";
  encryptedMessage: string; // ecnrypted with secret key of workspace
};

export type CursorSendMessage = {
  type: "cursor";
  encryptedMessage: string;
};

export type ReceivedMessage =
  | UsersListReceivedMessage
  | LeaderReceivedMessage
  | ContentReceivedMessage
  | CursorReceivedMessage;
