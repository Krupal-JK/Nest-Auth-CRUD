import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailService } from './email.service';
import { Otp } from './entities/otp.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp])],
  controllers: [UserController],
  providers: [UserService, EmailService],
})
export class UserModule {}
