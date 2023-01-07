import { IsNotEmpty, IsString } from 'class-validator';

export class CreateBannerAdDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}
