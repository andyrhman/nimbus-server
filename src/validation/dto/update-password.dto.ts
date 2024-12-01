import { IsString, Length } from 'class-validator';
import { IsEqualTo } from '../decorator/check-password.decorator';

export class UpdatePasswordDTO {
    @IsString()
    @Length(6, undefined, { message: 'Password must be at least 6 characters long' })
    password: string;

    @IsString()
    @IsEqualTo('password', { message: 'Password Confirm must be the same as password' })
    password_confirm: string;
}