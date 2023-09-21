import {
  Controller,
  Get,
  Param,
  Delete,
  Res,
  Patch,
  Body,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(@Res() res: Response) {
    const users = await this.usersService.findAll();
    return res.status(200).json(users);
  }

  @Get('/:id')
  async findOne(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({
        message: 'An error occurred while fetching user information',
      });
    }
  }

  @Patch(':id')
  async updateInforUser(
    @Res() res: Response,
    @Param('id') id: string,
    @Body() data: Partial<User>,
  ) {
    try {
      const updatedUser = await this.usersService.updateInforUser(data, id);
      return res.status(200).json(updatedUser);
    } catch (error) {
      return res
        .status(500)
        .json({ message: 'Có lỗi xảy ra trong quá trình cập nhật thông tin' });
    }
  }

  @Patch('isLocked/:userId')
  async updateLockedStatus(
    @Param('userId') userId: string,
    @Body() updateLockedDto: UpdateUserDto,
  ) {
    try {
      const updatedUser = await this.usersService.updateUser(
        userId,
        updateLockedDto,
      );
      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }
}
