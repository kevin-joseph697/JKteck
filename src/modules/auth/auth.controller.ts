import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpCreadentialsDto} from './dto/sign-up-user.dto';
import { SignInCreadentialsDto } from './dto/sign-in-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() signUpCreadentialsDto: SignUpCreadentialsDto
  ){
    return this.authService.register(signUpCreadentialsDto);
  }

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() signInCreadentialsDto: SignInCreadentialsDto
  ){
    return this.authService.login(signInCreadentialsDto);
  }
}
