import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // create new user service
  async register(createUserDto: CreateUserDto) {
    createUserDto.salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(
      createUserDto.password,
      createUserDto.salt,
    );
    return this.userRepository.save(createUserDto);
  }

  // update user credentials service
  async update(user, updateUserDto: UpdateUserDto) {
    return this.userRepository.update(user.id, updateUserDto);
  }

  // change user password service
  async changePassword(user, changePasswordDto: ChangePasswordDto) {
    const salt = await bcrypt.genSalt();
    changePasswordDto.salt = salt;
    changePasswordDto.password = await bcrypt.hash(
      changePasswordDto.password,
      salt,
    );
    return this.userRepository.update(user.id, changePasswordDto);
  }

  // find user by phone service
  async findByPhone(phone: string) {
    return this.userRepository.findOne({ phone: phone });
  }

  // get user profile service
  async getMe(req: any) {
    const theUser = await this.userRepository.findOne(req.user.id);
    return {
      phone: theUser.phone,
      email: theUser.email,
      firstName: theUser.firstName,
      lastName: theUser.lastName,
      role: theUser.role,
      isActive: theUser.isActive,
    };
  }
}
