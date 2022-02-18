import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly firstname: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly lastname: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  readonly password: string;

  @IsOptional()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  readonly salt: string;
}
