import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class LoginUserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  readonly password: string;
}
