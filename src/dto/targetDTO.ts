import { IsString } from 'class-validator';

export class TargetDTO {
  topicId!: number;

  @IsString()
  title?: string;

  radius!: number;

  location!: [number, number]
}
