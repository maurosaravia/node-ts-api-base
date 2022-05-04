import { Container } from 'typedi';
import { genSaltSync, hashSync } from 'bcrypt';
import { UsersService } from '@services/users.service';
import { User } from '@entities/user.entity';

let usersService: UsersService;

beforeAll(async () => {
  usersService = Container.get(UsersService);
});

describe('compare password', () => {
  let userPassword: string;

  beforeEach(() => {
    userPassword = hashSync('password', genSaltSync());
  });

  it('checks that the password matches', () => {
    const hashedPassword = 'password';
    const result = usersService.comparePassword({
      password: hashedPassword,
      userPassword
    });
    expect(result).toBeTruthy();
  });

  it("checks that the password don't match", () => {
    const password = 'anotherpassword';
    const result = usersService.comparePassword({ password, userPassword });
    expect(result).toBeFalsy();
  });
});

describe('user CRUD', () => {
  const user = new User();
  let userId : number;

  beforeEach(() => {
    user.firstName = 'Test';
    user.lastName = 'Test';
    user.gender = 'Test';
    user.email = 'test@test.test';
    user.password = 'Test';
  });

  it('create user', async () => {
    const result = await usersService.createUser(user);
    expect(result.identifiers['firstName']).toBe(user.firstName);
    userId = result.identifiers['id'];
  });

  it('get all users', async () => {
    const result = await usersService.listUsers();
    expect(result.length).toBeGreaterThan(0);
  });

  it('get one user', async () => {
    const result = await usersService.showUser(userId);
    expect(result).toBeDefined();
    expect(result?.firstName).toBe(user.firstName);
  });

  it('edit user', async () => {
    user.firstName = 'Test edit';
    const userInterface = { id: userId, user: user };

    const result = await usersService.editUser(userInterface);

    expect(result.affected).toBe(1);
  });

  it('delete user', async () => {
    const result = await usersService.deleteUser(userId);
    expect(result.affected).toBe(1);
  });
});
