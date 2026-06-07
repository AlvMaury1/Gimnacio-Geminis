import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

  export class LoginDto {
    @IsNotEmpty({message:"Email is required"})
    @IsEmail()
    email: string ;

    @IsNotEmpty({message:"Password is required"})
    @IsString()
    password: string;

    @IsNotEmpty({message:"Captcha token is required"})
    @IsString()
    captchaToken: string;
  }