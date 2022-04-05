import { IsOptional, IsString } from 'class-validator';
import { BaseUserDTO } from './baseUserDTO';

export class SignUpDTO extends BaseUserDTO {
  @IsString()
  firstName?: string;

  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  gender?: string;

  @IsOptional()
  @IsString()
  image?: string; // Image as Base64
}
