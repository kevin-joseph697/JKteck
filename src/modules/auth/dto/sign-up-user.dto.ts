import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignUpCreadentialsDto{
    
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    con_password: string;

    @IsString()
    @IsNotEmpty()
    roleName: string; 
  
}