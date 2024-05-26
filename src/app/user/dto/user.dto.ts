import { IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstname: string;

  @IsString()
  lastname: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class loginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
