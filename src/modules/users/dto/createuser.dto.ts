export class CreateUserDto {
    email: string;
    password: string;
    role: 'Admin' | 'Editor' | 'Viewer';
  }