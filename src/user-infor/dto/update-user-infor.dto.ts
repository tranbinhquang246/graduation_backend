import { IsString } from 'class-validator';

export class UpdateUserInforDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
}
