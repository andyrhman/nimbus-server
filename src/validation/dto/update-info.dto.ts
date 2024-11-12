import { IsString, Length, IsEmail, IsOptional } from 'class-validator';

export class UpdateInfoDTO {
    @IsString({ message: 'Nama must be a string' })
    @IsOptional()
    nama?: string;

    @IsString()
    @IsOptional()
    @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
    username?: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    @IsOptional()
    email?: string;
}