import {
  Body,
  Controller,
  Logger,
  Post,
  Put,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('user')
export class UserController {
  private readonly log = new Logger();

  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

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
  async loginUser(@Request() req): Promise<any> {
    try {
      return this.authService.login(req.user);
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put('/update-profile/:username')
  async updateUprofile(
    @Body() data: UpdateUserDTO,
    @Param('username') username: string,
  ) {
    try {
      const updatedUser = await this.userService.updateProfile(data, username);
      return { User: `${updatedUser.username} updated successfully` };
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }
}
