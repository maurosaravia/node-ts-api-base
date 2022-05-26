import { Service } from 'typedi';
import { compareSync, genSaltSync, hashSync } from 'bcrypt';
import { getRepository } from 'typeorm';
import { User } from '@entities/user.entity';
import { JWTService } from '@services/jwt.service';
import { AuthInterface, UserInterface } from '@interfaces';

@Service()
export class UsersService {
  constructor(private readonly jwtService: JWTService) {}

  private readonly userRepository = getRepository<User>(User);

  comparePassword(input: AuthInterface.IComparePasswordInput): boolean {
    const { password, userPassword } = input;
    return compareSync(password, userPassword);
  }

  generateToken(user: User) {
    return this.jwtService.createJWT(user);
  }

  hashPassword(password: string): string {
    return hashSync(password, genSaltSync());
  }

  hashUserPassword(user: User): void {
    user.password = this.hashPassword(user.password);
  }

  listUsers() {
    return this.userRepository.find();
  }

  showUser(id: number) {
    return this.userRepository.findOne(id);
  }

  showUserByEmail(email: string) {
    return this.userRepository.findOne({ where: { email: email } });
  }

  createUser(user: User) {
    this.hashUserPassword(user);
    return this.userRepository.insert(user);
  }

  editUser(input: UserInterface.IEditUserInput) {
    const { id, user } = input;
    return this.userRepository.update(id, user);
  }

  deleteUser(id: number) {
    return this.userRepository.delete(id);
  }

  verifyUser(id: number) {
    return this.userRepository.save({ id: id, verified: true });
  }

  async verifyAccount(
    token: string
  ): Promise<number> {
    try {
      if (!token) {
        return 0;
      }
      const payload = await this.jwtService.verifyJWT(token);
      const {
        data: { userId }
      } = payload;
      await this.verifyUser(userId);
      return userId;
    } catch (error) {
      // Here we should do something with the error like loggin
      console.log(error);
      return 0;
    }
  }

  async resetPassword(
    token: string,
    password: string
  ): Promise<number> {
    try {
      if (!token) {
        return 0;
      }
      const payload = await this.jwtService.verifyJWT(token);
      const {
        data: { userId }
      } = payload;
      await this.changeUserPassword(userId, password);
      return userId;
    } catch (error) {
      // Here we should do something with the error like loggin
      console.log(error);
      return 0;
    }
  }

  async changeUserPassword(id: number, password: string) {
    password = this.hashPassword(password);
    return this.userRepository.save({ id: id, password: password });
  }
}
