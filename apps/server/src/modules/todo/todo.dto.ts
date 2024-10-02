import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class TodoDto {
  @IsString()
  @IsNotEmpty()
  description: string;
}

export class ToggleCompleteDto {
  @IsBoolean()
  status: boolean;
}
