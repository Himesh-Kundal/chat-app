export interface ChatMessageProps {
  isSystemMessage: boolean;
  isOwnMessage: boolean;
  message: string;
  userName?: string;
}