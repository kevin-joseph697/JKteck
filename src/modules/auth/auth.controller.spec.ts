import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpCreadentialsDto } from './dto/sign-up-user.dto';
import { SignInCreadentialsDto } from './dto/sign-in-user.dto';
import * as bcrypt from 'bcrypt'

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    register: jest.fn(),
    login:jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should call AuthService.register with correct parameters', async () => {
    const dto: SignUpCreadentialsDto = {
      email: 'test@example.com',
      password: 'password123',
      con_password: 'password123',
      roleName: 'user',
    };

    mockAuthService.register.mockResolvedValue({
      statusCode: 200,
      message: ['User created successfully'],
    });

    const result = await authController.register(dto);

    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      statusCode: 200,
      message: ['User created successfully'],
    });
  });

  it('Should call AuthService.Login with correct parameters', async ()=>{
    const dto: SignInCreadentialsDto = {
      email:'test@gmail.com',
      password:'test123'
    }
    // jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    const token = 'mockToken'
    mockAuthService.login.mockResolvedValue(({
      statusCode:200,
      accessToken:token
    }))
    const result = await authService.login(dto)
    expect(authService.login).toHaveBeenCalledWith(dto)
    expect(result).toEqual({
      statusCode:200,
      accessToken:token
    })
  })
});
