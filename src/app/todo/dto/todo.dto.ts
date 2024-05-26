import { IsString } from 'class-validator';

export class CreateTodoDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  user_id: string;
}

export class updateTodoDto {
  @IsString()
  name: string;

  @IsString()
  description: string;
}
