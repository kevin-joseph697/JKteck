import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserRepository } from 'src/repository/user.repository';
import { RoleRepository } from 'src/repository/role.repository';
import { GetAllUserDto } from './dto/getAllUser.dto';

describe('UsersService', () => {
  let service: UsersService;
  let userRepository : any;
  let roleRepository : any;
  beforeEach(async () => {
    userRepository = {
      getAllUsers: jest.fn(),
      updateUserRole:jest.fn()
    }
    roleRepository = {
      findRoleIdByRoleName:jest.fn(),
      findRoleNameByRoleId:jest.fn()
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService,
        {provide:UserRepository,useValue:userRepository},
        {provide:RoleRepository,useValue:roleRepository}
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllUsers',() =>{
    it('Should call getAllUsers from user service with correct parameter',async()=>{
      const res : GetAllUserDto[] = [
        { id: 1, email: 'john.doe@example.com', roleId:'test' },
      ]
      userRepository.getAllUsers.mockResolvedValue(res)
      const result = await service.getAllUsers()
      expect(result).toEqual(res)
    })
    it('should handle repository errors gracefully', async () => {
    
      jest.spyOn(userRepository, 'getAllUsers').mockRejectedValue(new Error('Internal Server Error'));
  
      const result = await service.getAllUsers();
  
      expect(result).toEqual({
        statusCode: 500,
        message: ['Internal Server Error'],
        error: 'Bad Request',
      });
    });
  })

  describe('UpdateUserRole',()=>{
    it('should update user role successfully', async () => {
      const id = '123';
      const role = 'Admin';
      const roleId = { id: '1' };
  
      jest.spyOn(roleRepository, 'findRoleIdByRoleName').mockResolvedValue(roleId);
      jest.spyOn(userRepository, 'updateUserRole').mockResolvedValue({ affected: 1 });
  
      const result = await service.UpdateUserRole(id, role);
  
      expect(result).toEqual({
        statusCode: 200,
        message: ['User role updated successfully'],
      });
  
      expect(roleRepository.findRoleIdByRoleName).toHaveBeenCalledWith(role);
      expect(userRepository.updateUserRole).toHaveBeenCalledWith(id, roleId.id);
    });
    it('should throw NotFoundException if role is not found', async () => {
      const id = '123';
      const role = 'InvalidRole';
  
      jest.spyOn(roleRepository, 'findRoleIdByRoleName').mockResolvedValue(null);
  
      const result = await service.UpdateUserRole(id, role);
  
      expect(result).toEqual({
        statusCode: 404,
        message: ['Role not found'],
        error: 'Bad Request',
      });
  
      expect(roleRepository.findRoleIdByRoleName).toHaveBeenCalledWith(role);
      expect(userRepository.updateUserRole).not.toHaveBeenCalled();
    });

    it('should return 400 if id or role is missing', async () => {
      const result = await service.UpdateUserRole('', '');
  
      expect(result).toEqual({
        statusCode: 400,
        message: 'Details were not provided',
      });
    });
    it('should handle repository errors gracefully', async () => {
      const id = '123';
      const role = 'Admin';
      const roleId = { id: '1' };
  
      jest.spyOn(roleRepository, 'findRoleIdByRoleName').mockResolvedValue(roleId);
      jest.spyOn(userRepository, 'updateUserRole').mockRejectedValue(new Error('Internal Server Error'));
  
      const result = await service.UpdateUserRole(id, role);
  
      expect(result).toEqual({
        statusCode: 500,
        message: ['Internal Server Error'],
        error: 'Bad Request',
      });
    });
  })

});
