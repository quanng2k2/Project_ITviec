import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { signupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private usersRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(signupdto: signupDto) {
    try {
      const checkEmail = await this.usersRepo.findOne({
        where: { user_email: signupdto.user_email },
      });
      if (checkEmail) {
        return { message: 'Email đã được đăng ký' };
      }

      const hashedPassword = await bcrypt.hash(signupdto.user_passwords, 10); // Use bcryptjs for hashing
      const newUser = this.usersRepo.create({
        user_name: signupdto.user_name,
        user_email: signupdto.user_email,
        user_passwords: hashedPassword,
        roles: 2,
        isLocked: 0,
      });

      await this.usersRepo.save(newUser);
      delete newUser.user_passwords;

      // Return success message and user data
      return { message: 'Signup successful', user: newUser };
    } catch (error) {
      // Handle errors properly and return appropriate response
      throw new Error('Có lỗi xảy ra. Vui lòng thử lại sau.');
    }
  }

  async login(logindto: any, res: any) {
    try {
      console.log(logindto);

      const user = await this.usersRepo.findOne({
        where: { user_email: logindto.email },
      });

      if (!user) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      const isPasswordValid = await bcrypt.compare(
        logindto.passwords,
        user.user_passwords,
      );

      if (!isPasswordValid) {
        throw new Error('Email hoặc mật khẩu không đúng');
      }

      const token = this.jwtService.sign({ user_id: user.user_id });

      // Trả về một phản hồi thành công với mã thông báo và thông tin người dùng
      return res
        .status(200)
        .json({ message: 'Đăng nhập thành công', token, user });
    } catch (error) {
      // Nếu có lỗi xảy ra trong quá trình xử lý, ném một ngoại lệ BadRequestException với thông báo lỗi
      throw new BadRequestException(error.message);
    }
  }
}
