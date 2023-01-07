import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCollectionImageDto {
  @IsNotEmpty()
  @IsString()
  title: string;
}
