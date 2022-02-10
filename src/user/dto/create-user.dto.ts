import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly firstname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly lastname: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  readonly password: string;
}
