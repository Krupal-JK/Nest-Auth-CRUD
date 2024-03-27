import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {

  constructor(@InjectRepository(User) private readonly userRepository: Repository<User>){}

  async create(createUserDto: CreateUserDto) {
    const options: FindOneOptions<User> = { where: { email: createUserDto.email } };
    const existUser = await this.userRepository.findOne(options)
    if(existUser)
      return {code:409, message: 'User already exist'}    

    let user: User = new User()
    user.first_name = createUserDto.first_name
    user.last_name = createUserDto.last_name
    user.age = createUserDto.age
    user.email = createUserDto.email
    return await this.userRepository.save(user)
  }

  async findAll() {
    return await this.userRepository.find()
  }

  async findOne(id: number) {
    const options: FindOneOptions<User> = { where: { id } };
    const data = await this.userRepository.findOne(options);
    if(data)
      return data
    else      
      return {code: 404, message: "User not found"}
}

  async update(id: number, updateUserDto: UpdateUserDto) {
    let user: User = new User()
    user.first_name = updateUserDto.first_name
    user.last_name = updateUserDto.last_name
    user.age = updateUserDto.age
    user.email = updateUserDto.email
    user.id = id
    return await this.userRepository.save(user)
  }

  remove(id: number) {
    return this.userRepository.delete(id)
  }
}
