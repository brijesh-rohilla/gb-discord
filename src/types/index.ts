export interface UserType {
  userId: string;
  userName: string;
}

export const userDefault: UserType = {
  userId: '',
  userName: '',
};

export interface MessageType {
  createdAt: Date;
  userId: string;
  message: string,
  userName: string;
  messageId: string;
}
