import { IsNumber, IsString } from 'class-validator';

export class ConversationDTO {
  @IsNumber()
  user1Id!: number;

  @IsNumber()
  user2Id!: number;

  @IsNumber()
  unreadCount!: number;

  @IsString()
  lastMessage!: string;
}
