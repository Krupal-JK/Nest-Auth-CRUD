import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, ForgotPasswordDto, OtpDto, ResetPasswordDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/middleware/verify.token.middleware';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('addUser')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('sendOtp')
  sendOtp(@Body() createUserDto: CreateUserDto) {
    return this.userService.sendOtp(createUserDto);
  }

  @Post('verifyUser')
  verify(@Body() otpDto: OtpDto) {
    return this.userService.verify(otpDto);
  }

  @Post('login')
  login(@Body() createUserDto: CreateUserDto) {
    return this.userService.login(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get('getAllUsers')
  findAll() {
    return this.userService.findAll();
  }

  @Get('/getOne/:id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch('/updateUser/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Patch('/resetPassword/:id')
  resetPassword(@Param('id') id: string, @Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(+id, resetPasswordDto);
  }

  @Patch('/forgotPassword')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Delete('/deleteUser/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}

