import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  SignupBusinessDto,
  SignupClientDto,
  SignupWorkerDto,
} from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('post/new/token')
  renewAccessToken(@Body() token: string) {
    return this.authService.renewAccessToken(token);
  }

  @Post('post/login')
  login(@Body() data: LoginDto) {
    return this.authService.signIn(data);
  }

  @Post('post/signup/delivery')
  signupDelivery(@Body() data: SignupClientDto) {
    return this.authService.signupDelivery(data);
  }

  @Post('post/signup/worker')
  signupWorker(@Body() data: SignupWorkerDto) {
    return this.authService.signupWorker(data);
  }

  @Post('post/signup/client')
  signUpClient(@Body() data: SignupClientDto) {
    return this.authService.signUpClient(data);
  }

  @Post('post/signup/business')
  signUpBusiness(@Body() data: SignupBusinessDto) {
    return this.authService.signUpBusiness(data);
  }
}
