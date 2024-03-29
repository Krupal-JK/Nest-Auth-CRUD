import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, OtpDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/middleware/verify.token.middleware';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('addUser')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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

  @Delete('/deleteUser/:id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
