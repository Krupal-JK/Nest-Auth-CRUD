import { Body, Injectable } from '@nestjs/common';
import { CreateUserDto, OtpDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { EmailService } from './email.service';
import { Otp } from './entities/otp.entity';
 

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const options: FindOneOptions<User> = {
        where: { email: createUserDto.email },
      };

      const existUser = await this.userRepository.findOne(options);
      if (existUser) return { code: 409, message: 'User already exist' };

      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;

      function validatePassword(password) {
        return passwordRegex.test(password);
      }

      if(!validatePassword(createUserDto.password))
        return { code: 404, message: 'Password must be minimum six characters, at least one letter and one number'}

      let user: User = new User();

      user.first_name = createUserDto.first_name;
      user.last_name = createUserDto.last_name;
      user.age = createUserDto.age;
      user.email = createUserDto.email;
      
      const hashPass = await bcrypt.hash(createUserDto.password, 10);
      user.password = hashPass;
      
      const result = await this.userRepository.save(user);
      
      let otp: Otp = new Otp();
      
      const otpOptions: FindOneOptions<Otp> = {where: { email: createUserDto.email },};
      let existOTP = await this.otpRepository.findOne(otpOptions)
      console.log(existOTP, "==++++++++")

      // const otpNumber : string = (Math.floor(100000 + Math.random() * 900000)).toString()
      const otpNumber : string = "1111"
      let hashOTP = await bcrypt.hash(otpNumber, 10);

      const now = new Date();
      const oneHourLater = new Date(now.getTime() + 1 * 60 * 60 * 1000);

      if(existOTP){

        await this.otpRepository.delete(existOTP.id) 
        otp.email = createUserDto.email;
        otp.otp = hashOTP
        otp.expire_time = oneHourLater
        await this.otpRepository.save(otp);   
      }else{     
        
        otp.email = createUserDto.email;
        otp.otp = hashOTP     
        otp.expire_time = oneHourLater
        await this.otpRepository.save(otp);
      }     

      await this.emailService.sendVerifyEmail(createUserDto.email, Number(otpNumber))
      
      return { code: 201, message: 'User created succesfully', result };
    } catch (error) {
      return { code: 500, message: error.message };
    }
  }

  async verify(@Body() otpDto: OtpDto) {
    try {
      
      const otpOptions: FindOneOptions<Otp> = {where: { email: otpDto.email },};
      let existOTP = await this.otpRepository.findOne(otpOptions)
      
      if(!existOTP) return { code: 404, message: "Otp expired!" };

      if(existOTP && new Date(existOTP.expire_time) < new Date()) return { code: 404, message: "Otp expired!"}

      const isMatch = await bcrypt.compare(otpDto.otp, existOTP?.otp.toString())

      if(!isMatch) return { code: 404, message: "Invalid OTP!" }
      
      const userOptions: FindOneOptions<User> = {where: { email: otpDto.email },};
      let existUser = await this.userRepository.findOne(userOptions)

      if(!existUser) return { code: 404, message: "User not found!" };
      
      existUser.verified = true

      const result = await this.userRepository.save(existUser)

      await this.otpRepository.delete(existOTP.id)

      return { code: 201, message: 'User verified succesfully', result };
    } catch (error) {
      return { code: 500, message: error.message };
    }
  }

  async login(@Body() createUserDto: CreateUserDto) {
    try {
          
      const userOptions: FindOneOptions<User> = {where: { email: createUserDto.email },};
      let existUser = await this.userRepository.findOne(userOptions)

      if(!existUser) return { code: 404, message: "User not found!" };
      
      const isMatch = await bcrypt.compare(createUserDto.password, existUser.password.toString())
      
      if(!isMatch) return { code: 404, message: "Invalid password!" };

      if(!existUser.verified) return { code: 404, message: "User not verified!" };

      const token = await jwt.sign({ email: existUser.email, user_id: existUser.id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_SECRET_EXPIRATION})

      return { code: 201, message: 'User login succesfully', existUser, token}
    } catch (error) {
      return { code: 500, message: error.message };
    }
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number) {
    const options: FindOneOptions<User> = { where: { id } };
    const data = await this.userRepository.findOne(options);
    if (data) return data;
    else return { code: 404, message: 'User not found' };
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      const options: FindOneOptions<User> = {
        where: { email: updateUserDto.email },
      };

      const existUser = await this.userRepository.findOne(options);
      if (existUser && existUser.id !== id) return { code: 409, message: 'Email is already in use!' };

      let user: User = new User();
      user.first_name = updateUserDto.first_name;
      user.last_name = updateUserDto.last_name;
      user.age = updateUserDto.age;
      user.email = updateUserDto.email;
      user.id = id;

      const updatedUser = await this.userRepository.save(user);
      return {code: 201, message: "User updated successfully", updatedUser}
      
    } catch (error) {
      return { code: 500, message: error.message };
    }
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
