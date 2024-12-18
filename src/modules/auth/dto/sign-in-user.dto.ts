import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInCreadentialsDto{
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
  
}