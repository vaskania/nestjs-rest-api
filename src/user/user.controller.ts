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
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UserService } from './user.service';
import { LocalAuthGuard } from 'src/auth/guards/local-auth.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateUserDTO } from './dto/update-user.dto';
import { AuthService } from 'src/auth/auth.service';
import { UserAlreadyExists, UserNotFoundError } from './user.constants';

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
      this.log.error(UserAlreadyExists);
      throw new HttpException(UserAlreadyExists, HttpStatus.BAD_REQUEST);
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
    @Body() data: Partial<UpdateUserDTO>,
    @Param('username') username: string,
  ): Promise<{ user: string }> {
    try {
      const updatedUser = await this.userService.updateProfile(data, username);
      return { user: `${updatedUser.username} updated successfully` };
    } catch (error) {
      this.log.error(UserNotFoundError);
      throw new HttpException(UserNotFoundError, HttpStatus.NOT_FOUND);
    }
  }

  @Get('/:username')
  async getUserProfile(
    @Param('username') username: string,
  ): Promise<{ username: string; createdAt: Date; updatedAt: Date }> {
    try {
      const user = await this.userService.getUser(username);
      return {
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    } catch (error) {
      this.log.error(UserNotFoundError);
      throw new HttpException(UserNotFoundError, HttpStatus.NOT_FOUND);
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
      throw new HttpException(error.message, HttpStatus.NOT_FOUND);
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
      this.log.error(UserNotFoundError);
      throw new HttpException(UserNotFoundError, HttpStatus.NOT_FOUND);
    }
  }
}
