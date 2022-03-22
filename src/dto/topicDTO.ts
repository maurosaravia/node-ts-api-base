import { IsString } from 'class-validator';

export class TopicDTO {
  @IsString()
  name?: string;

  @IsString()
  image?: string; // Base64
}
