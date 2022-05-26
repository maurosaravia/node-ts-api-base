import {
  JsonController,
  Param,
  Body,
  Get,
  Post,
  Put,
  Delete,
  Authorized,
  BadRequestError,
  CurrentUser
} from 'routing-controllers';
import { InsertResult, UpdateResult, DeleteResult } from 'typeorm';
import { Container, Service } from 'typedi';
import { User } from '@entities/user.entity';
import { UsersService } from '@services/users.service';
import { ErrorsMessages } from '../constants/errorMessages';
import { SignUpDTO } from '@dto/signUpDTO';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { Roles } from '@constants/Roles';
import { EmailService } from '@services/email.service';
import { ResetPasswordDTO } from '@dto/resetPasswordDTO';

@JsonController('/users')
@Service()
export class UserController {
  constructor(private readonly usersService: UsersService) {}

  @Authorized(Roles.Admin)
  @Get()
  async index(): Promise<User[]> {
    return this.usersService.listUsers();
  }

  @Authorized(Roles.Admin)
  @Get('/:id')
  async show(@Param('id') id: number): Promise<User | undefined> {
    return this.usersService.showUser(id);
  }

  @Authorized(Roles.Admin)
  @Post()
  async post(@Body() userDTO: SignUpDTO): Promise<InsertResult> {
    try {
      return await this.usersService.createUser(
        EntityMapper.mapTo(User, userDTO)
      );
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Authorized(Roles.Admin)
  @Put('/:id')
  async updateUser(
    @Param('id') id: number,
    @Body() userDTO: SignUpDTO
  ): Promise<UpdateResult> {
    const user: User = EntityMapper.mapTo(User, userDTO);
    return this.usersService.editUser({ id, user });
  }

  @Authorized(Roles.User)
  @Put()
  async updateSelf(
    @CurrentUser() id: number,
    @Body() userDTO: SignUpDTO
  ): Promise<UpdateResult> {
    const user: User = EntityMapper.mapTo(User, userDTO);
    return this.usersService.editUser({ id, user });
  }

  @Authorized(Roles.Admin)
  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return this.usersService.deleteUser(id);
  }

  @Get('verify/:token')
  async verify(
    @Param('token') token: string
  ) {
    return this.usersService.verifyAccount(token);
  }

  @Authorized()
  @Post('resend/')
  async resendVerification(
    @CurrentUser() id: number
  ) {
    const user = await this.usersService.showUser(id);
    if (user) {
      const emailService = Container.get(EmailService);
      await emailService.sendVerification(user);
    }
  }

  @Post('passwordReset')
  async passwordReset(
    @Body() email: string
  ) {
    const user = await this.usersService.showUserByEmail(email);
    if (user) {
      const emailService = Container.get(EmailService);
      await emailService.sendPasswordReset(user);
    }
    return user;
  }

  @Post('resetPassword')
  async resetPassword(
    @Body() passwordDTO: ResetPasswordDTO
  ) {
    return this.usersService.resetPassword(passwordDTO.token, passwordDTO.password);
  }
}
