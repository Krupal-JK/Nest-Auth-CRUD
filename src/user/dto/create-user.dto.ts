export class CreateUserDto {
    first_name: string;
    last_name: string;
    age: number;
    email: string;
    password: string;
}

export class OtpDto {
    email: string;
    otp: string;   
    verify: boolean; 
}

export class ResetPasswordDto {
    old_pass: string;
    new_pass: string;    
}

export class ForgotPasswordDto {
    email: string;
    new_pass: string;    
}