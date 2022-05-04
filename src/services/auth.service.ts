import Container from 'typedi';
import { JWTService } from '@services/jwt.service';
import { RedisService } from '@services/redis.service';
import { Action } from 'routing-controllers';
import { UsersService } from './users.service';

export class AuthorizationService {
  private static instance: AuthorizationService;

  public static getInstance(): AuthorizationService {
    if (!this.instance) {
      this.instance = new AuthorizationService();
    }

    return this.instance;
  }

  async authorizationChecker(
    action: Action,
    _roles: string[]
  ): Promise<boolean> {
    const jwt = Container.get(JWTService);
    const redis = Container.get(RedisService);
    try {
      let token = action.request.headers['authorization'];
      if (!token) {
        return false;
      }
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from authentication scheme header
        token = token.replace('Bearer ', '');
      }
      const payload = await jwt.verifyJWT(token);
      const {
        data: { userId, email }
      } = payload;
      const tokenIsBlacklisted: number = await redis.isMemberOfSet({
        email,
        token
      });
      if (!!tokenIsBlacklisted) {
        return false;
      }
      if (_roles && _roles.length > 0) {
        const usersService = Container.get(UsersService);
        const user = await usersService.showUser(userId);
        if (user != null) {
          return _roles.includes(user.role);
        }
      }
      return true;
    } catch (error) {
      // Here we should do something with the error like loggin
      return false;
    }
  }

  async getCurrentUser(
    action: Action
  ): Promise<number> {
    const jwt = Container.get(JWTService);
    try {
      let token = action.request.headers['authorization'];
      if (!token) {
        return 0;
      }
      if (token.startsWith('Bearer ')) {
        // Remove Bearer from authentication scheme header
        token = token.replace('Bearer ', '');
      }
      const payload = await jwt.verifyJWT(token); // ToDo Cambiar a DecodeJWT
      const {
        data: { userId }
      } = payload;
      return userId;
    } catch (error) {
      // Here we should do something with the error like loggin
      console.log(error);
      return 0;
    }
  }
}
