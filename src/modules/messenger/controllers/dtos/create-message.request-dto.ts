export class CreateMessageRequestDto {
  theme: string;
  content: string;
  senderId: string;
  receiverId?: string;
  messageId?: string;
}
