import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  // create new user
  async create(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    createUserDto.salt = salt;
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);
    return this.usersRepository.save(createUserDto);
  }

  // validate user cridentials
  async validateUser(phone: string, pass: string): Promise<any> {
    const user = await this.usersService.findByPhone(phone);
    const hashedPass = await bcrypt.hash(pass, user.salt);
    if (user && user.password === hashedPass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  // login user and create access token
  async login(user: any) {
    const payload = { phone: user.phone, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
