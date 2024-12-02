import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserRepository } from 'src/repository/user.repository';  // Adjust based on actual path
import { RoleRepository } from 'src/repository/role.repository';  // Adjust based on actual path
import { JwtService } from '@nestjs/jwt';
import { ConflictException, NotFoundException, BadRequestException, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let authService: AuthService;
  let mockUserRepository: any;
  let mockRoleRepository: any;
  let mockJwtService: any;

  beforeEach(async () => {
    mockUserRepository = {
      findOneUser: jest.fn(),
      registerUser: jest.fn(),
      login: jest.fn(),
    };  

    mockRoleRepository = {
      findRoleIdByRoleName: jest.fn(),
      findRoleNameByRoleId: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UserRepository,
        { provide: UserRepository, useValue: mockUserRepository }, 
        { provide: RoleRepository, useValue: mockRoleRepository },  
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  describe('register', () => {
    it('should successfully register a user', async () => {
      const signUpCreadentialsDto = {
        email: 'test@example.com',
        password: 'password123',
        con_password: 'password123',
        roleName: 'user',
      };

      mockUserRepository.findOneUser.mockResolvedValue(null); 
      mockRoleRepository.findRoleIdByRoleName.mockResolvedValue({ id: 1 }); 
      mockUserRepository.registerUser.mockResolvedValue(true);

      const result = await authService.register(signUpCreadentialsDto);

      expect(result).toEqual({
        statusCode: 200,
        message: ['User created successfully'],
      });
    });

    it('should throw ConflictException if the email already exists', async () => {
      const signUpCreadentialsDto = {
        email: 'test@example.com',
        password: 'password123',
        con_password: 'password123',
        roleName: 'user',
      };
      mockUserRepository.findOneUser.mockResolvedValue({ email: 'test@example.com' });

      try {
        await authService.register(signUpCreadentialsDto);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictException);
        expect(error.message).toBe('Email already exists');
      }
    });

    it('should throw NotFoundException if the role is not found', async () => {
      const signUpCreadentialsDto = {
        email: 'test@example.com',
        password: 'password123',
        con_password: 'password123',
        roleName: 'user',
      };
      mockUserRepository.findOneUser.mockResolvedValue(null); 
      mockRoleRepository.findRoleIdByRoleName.mockResolvedValue(null); 

      try {
        await authService.register(signUpCreadentialsDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('Role not found');
      }
    });

    it('should return BadRequestException if passwords do not match', async () => {
      const signUpCreadentialsDto = {
        email: 'test@example.com',
        password: 'password123',
        con_password: 'password456',
        roleName: 'user',
      };

      const result = await authService.register(signUpCreadentialsDto);
      expect(result).toEqual({
        statusCode: 400,
        message: ['Your passwords does not match'],
        error: 'Bad Request',
      });
    });

    it('should return BadRequestException if necessary details are missing', async () => {
      const signUpCreadentialsDto = {
        email: '',
        password: '',
        con_password: '',
        roleName: '',
      };

      try {
        await authService.register(signUpCreadentialsDto);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Necessary details not found');
      }
    });
  });

  describe('login', () =>   {
    it('should successfully login a user and return a token', async () => {
      const signInCreadentialsDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      const user = { id: 1, email: 'test@example.com', password: 'hashedpassword', roleId: 1 };
      const roleName = { name: 'user' };
      const token = 'mockedToken';
      mockUserRepository.login.mockResolvedValue(user);
      mockRoleRepository.findRoleNameByRoleId.mockResolvedValue(roleName);
      mockJwtService.sign.mockReturnValue(token);
      const result = await authService.login(signInCreadentialsDto);
      expect(result).toEqual({
        statusCode: 200,
        accessToken: token,
      });
    });
    it('should throw NotFoundException if the user is not found', async () => {
      const signInCreadentialsDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      mockUserRepository.login.mockResolvedValue(null);

      try {
        await authService.login(signInCreadentialsDto);
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
        expect(error.message).toBe('User not found');
      }
    });

    it('should throw UnauthorizedException if password is incorrect', async () => {
      const signInCreadentialsDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const user = { id: 1, email: 'test@example.com', password: 'hashedpassword' };
      mockUserRepository.login.mockResolvedValue(user);
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      try {
        await authService.login(signInCreadentialsDto);
      } catch (error) {
        expect(error).toBeInstanceOf(UnauthorizedException);
        expect(error.message).toBe('Invalid credentials');
      }
    });

    it('should return BadRequestException if credentials are not provided', async () => {
      const signInCreadentialsDto = {
        email: '',
        password: '',
      };

      const result = await authService.login(signInCreadentialsDto);
      expect(result).toEqual({
        statusCode: 400,
        message: 'Details were not provided',
      });
    });
    
  });
});
