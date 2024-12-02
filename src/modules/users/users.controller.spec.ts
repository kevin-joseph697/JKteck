import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersEntity } from 'src/entities/user.entities';
import { GetAllUserDto } from './dto/getAllUser.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let userService:  UsersService
  const  mockUserService = {
    getAllUsers:jest.fn(),
    UpdateUserRole:jest.fn()
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{provide:UsersService,useValue:mockUserService}],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    userService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('Should call getAllUsers with correct parameters',async()=>{
    const res : GetAllUserDto[] = [
      { id: 1, email: 'john.doe@example.com', roleId:'test' },
    ]
    mockUserService.getAllUsers.mockResolvedValue(res)
    const result = await controller.getAllUsers()
    expect(userService.getAllUsers).toHaveBeenCalled()
    expect(result).toEqual(res)
  })
  it('Should Call updateUserRole with correct parameter',async()=>{
    const id = '1';
    const body = { role: 'Admin' };
    const response = {
      statusCode:200,
      message:['User role updated successfully']
  }
    mockUserService.UpdateUserRole.mockResolvedValue(response)
    const result = await controller.updateUserRole(id,body)
    expect(userService.UpdateUserRole).toHaveBeenCalledWith(id,body['role'])
    expect(result).toEqual(response)
  })
});
