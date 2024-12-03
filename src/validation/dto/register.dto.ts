import { IsString, Length, IsEmail, Matches } from 'class-validator';
import { IsEqualTo } from '../decorator/check-password.decorator';

export class RegisterDto {
    @IsString({ message: 'Nama must be a string' })
    nama: string;

    @IsString()
    @Length(3, 30, { message: 'Username must be between 3 and 30 characters' })
    @Matches(/^\S*$/, { message: 'Username must not contain spaces' })
    username: string;

    @IsEmail({}, { message: 'Email must be a valid email address' })
    email: string;

    @IsString()
    @Length(6, undefined, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @IsEqualTo('password', { message: 'Password Confirm must be the same as password' })
    password_confirm: string;
}