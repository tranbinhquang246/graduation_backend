import { IsString } from 'class-validator';

export class UpdateUserInforDto {
  @IsString()
  avatar: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
