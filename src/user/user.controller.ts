import {
  Controller,
  Get,
  Body,
  Request,
  UseGuards,
  Put,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UsersController {
  constructor(private readonly userService: UserService) {}

  // create new user route
  @Post('register')
  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  // update user credentials route
  @UseGuards(JwtAuthGuard)
  @Put('update')
  update(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user, updateUserDto);
  }

  // change user password route
  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  changePassword(@Request() req, @Body() changePasswordDto: ChangePasswordDto) {
    return this.userService.changePassword(req.user, changePasswordDto);
  }

  // get user profile route
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@Request() req) {
    return this.userService.getMe(req);
  }
}
