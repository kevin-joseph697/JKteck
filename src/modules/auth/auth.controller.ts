import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpCreadentialsDto} from './dto/sign-up-user.dto';
import { SignInCreadentialsDto } from './dto/sign-in-user.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string' },
        passworrd: { type: 'string' },
        con_password:{type:'string'},
        roleName:{type:'string'}
      },
    },
  })
  async register(
    @Body() signUpCreadentialsDto: SignUpCreadentialsDto
  ){
    return this.authService.register(signUpCreadentialsDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: {type: 'string'},
        passworrd: {type: 'string'}
      },
    },
  })
  async login(
    @Body() signInCreadentialsDto: SignInCreadentialsDto
  ){
    return this.authService.login(signInCreadentialsDto);
  }
}
