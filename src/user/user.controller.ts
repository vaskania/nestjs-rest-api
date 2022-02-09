import { Body, Controller, Logger, Post, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LoginUserDTO } from './dto/user-login.dto';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';

@Controller('user')
export class UserController {
  private readonly log = new Logger();

  constructor(private readonly userService: UserService) {}

  @Post('register')
  async createUser(@Body() user: CreateUserDTO): Promise<any> {
    try {
      const newUser = await this.userService.createUser(user);
      return { user: `${newUser.username} created successfully` };
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async loginUser(@Body() user: LoginUserDTO): Promise<any> {
    return 'logged in';
  }
}
