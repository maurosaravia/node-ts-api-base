import { IsNumber, IsString } from 'class-validator';

export class MessageDTO {
  @IsNumber()
  conversationId!: number;

  @IsNumber()
  receiverId!: number

  @IsString()
  content!: string;
}
