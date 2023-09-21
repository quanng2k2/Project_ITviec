import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async findAll() {
    try {
      const allUsers = await this.usersRepo.find();
      return allUsers;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async findOne(id: string) {
    try {
      const findUser = await this.usersRepo.findOne({
        where: { user_id: id },
      });
      return findUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateInforUser(data: Partial<User>, id: string) {
    try {
      const findUser = await this.usersRepo.findOne({
        where: { user_id: id },
      });
      if (!findUser) {
        throw new NotFoundException('User not found');
      }

      // Cập nhật thông tin với các trường mới
      if (data.position) {
        findUser.position = data.position;
      }

      if (data.dateOfbirth) {
        findUser.dateOfbirth = data.dateOfbirth;
      }

      if (data.phoneNumber) {
        findUser.phoneNumber = data.phoneNumber;
      }

      if (data.address) {
        findUser.address = data.address;
      }
      // Lưu lại thông tin đã cập nhật vào database
      await this.usersRepo.save(findUser);
      return findUser;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async updateUser(userId: string, updateLockedDto: UpdateUserDto) {
    try {
      const user = await this.usersRepo.findOne({ where: { user_id: userId } });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      // Nếu updateLockedDto.isLocked không được cung cấp (undefined) thì giữ nguyên trạng thái
      user.isLocked =
        updateLockedDto.isLocked !== undefined
          ? updateLockedDto.isLocked
          : user.isLocked;

      // Lưu lại thông tin đã cập nhật vào database
      const updatedUser = await this.usersRepo.save(user);

      return updatedUser;
    } catch (error) {
      throw new BadRequestException(error.message); // Sử dụng error.message thay vì toàn bộ error object
    }
  }
}
