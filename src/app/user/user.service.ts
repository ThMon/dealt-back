import { Injectable } from '@nestjs/common';
import { User } from './schemas/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, loginDto } from './dto/user.dto';
import ResponseRequest from 'src/common/ResponseRequest';
import { validerEmail } from 'src/common/utils';
import { hash, compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AUTH_TOKEN_EXPIRE, REFRESH_TOKEN_EXPIRE } from 'src/common/constant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ResponseRequest> {
    if (!validerEmail(createUserDto.email)) {
      return new ResponseRequest({
        status: 404,
        error: {
          msg: 'Email incorrect',
          error: 'You have to use a correct email',
        },
        data: null,
      });
    }

    const existedUser = await this.userModel
      .find({ email: createUserDto.email })
      .exec();

    if (existedUser.length > 0) {
      return new ResponseRequest({
        status: 409,
        error: {
          msg: 'User email already exist',
          error:
            'We found a user using this email in this database, please use an other or call an administrator',
        },
        data: null,
      });
    }

    const createdUser = new this.userModel({
      ...createUserDto,
      password: await hash(createUserDto.password, 10),
    });

    try {
      const result = await createdUser.save();
      return new ResponseRequest({ status: 200, error: null, data: result });
    } catch (e) {
      return new ResponseRequest({
        status: 500,
        error: { msg: 'DB problem', error: e },
        data: null,
      });
    }
  }

  async login(loginDto: loginDto) {
    const user = await this.validateUser(loginDto);

    const payload = user
      ? {
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
        }
      : null;

    return user
      ? new ResponseRequest({
          status: 200,
          error: null,
          data: {
            user: {
              _id: user._id,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
            },
            backendTokens: {
              accessToken: await this.jwtService.signAsync(payload, {
                expiresIn: AUTH_TOKEN_EXPIRE,
                secret: process.env.jwtSecretKey,
              }),
              refreshToken: await this.jwtService.signAsync(payload, {
                expiresIn: REFRESH_TOKEN_EXPIRE,
                secret: process.env.jwtRefreshTokenKey,
              }),
            },
          },
        })
      : new ResponseRequest({
          status: 404,
          error: { msg: 'user not found', error: {} },
          data: null,
        });
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userModel.find({ email });
      return new ResponseRequest({ status: 200, error: null, data: user });
    } catch (e) {
      return new ResponseRequest({
        status: 500,
        error: { msg: 'DB problem', error: e },
        data: null,
      });
    }
  }

  async findById(id: string) {
    try {
      const user: any = await this.userModel.find({ _id: id });
      return new ResponseRequest({
        status: 200,
        error: null,
        data: {
          user,
        },
      });
    } catch (e) {
      return new ResponseRequest({
        status: 500,
        error: { msg: 'DB problem', error: e },
        data: null,
      });
    }
  }

  async validateUser(loginDto: loginDto) {
    const response = await this.findByEmail(loginDto.email);
    if (response.data.length > 0) {
      const user = response.data[0];
      if (user && (await compare(loginDto.password, user.password))) {
        return user;
      }
      null;
    }
  }
}
