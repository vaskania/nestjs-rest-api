import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Logger,
  Query,
  UseGuards,
  Request,
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

  @Post('/register')
  async createUser(@Body() user: CreateUserDTO): Promise<{ user: string }> {
    try {
      const newUser = await this.userService.createUser(user);
      return { user: `${newUser.username} created successfully` };
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async loginUser(
    @Request() req: { user: { username: string; role: string } },
  ): Promise<{ access_token: string }> {
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
  ): Promise<{ user: string }> {
    try {
      const updatedUser = await this.userService.updateProfile(
        {
          firstname: data.firstname,
          lastname: data.lastname,
          password: data.password,
        },
        username,
      );
      return { user: `${updatedUser.username} updated successfully` };
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }

  @Get('/:username')
  async getUserProfile(
    @Param('username') username: string,
  ): Promise<{ user: string; createdAt: Date; updatedAt: Date }> {
    try {
      const {
        username: user,
        createdAt,
        updatedAt,
      } = await this.userService.getUser(username);
      return { user, createdAt, updatedAt };
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }

  @Get('/users/list')
  async getUsersList(
    @Query('pageNumber') pageNumber: '0',
    @Query('limit')
    limit: '3',
  ) {
    try {
      const usersList = await this.userService.getUsers(pageNumber, limit);
      return usersList.map((user) => {
        return {
          username: user.username,
          firstName: user.firstname,
          lastName: user.lastname,
        };
      });
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username')
  async deleteUserById(
    @Param('username') username: string,
  ): Promise<{ User: string }> {
    try {
      const user = await this.userService.deleteUser(username);
      return { User: `${user.username} deleted successfully` };
    } catch (error) {
      this.log.error(error);
      throw error;
    }
  }
}
