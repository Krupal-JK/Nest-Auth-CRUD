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
}
