import { Controller, Res, Req, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { LoginDto, SignupBusinessDto, SignupClientDto } from './dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('post/new/token')
  async renewAccessToken(@Req() req: Request) {
    const refreshToken = req.cookies['refresh_token'];
    return await this.authService.renewAccessToken(refreshToken);
  }

  @Post('post/login')
  async login(@Res() res: Response, @Body() data: LoginDto) {
    const user = await this.authService.signIn(data);
    if (!user.success)
      return res.json({
        success: user.success,
        message: user.message,
        status: user.status,
      });

    res.cookie('refresh_token', user.data.refresh_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: user.success,
      message: user.message,
      status: user.status,
      data: user.data.access_token,
    });
  }

  @Post('post/signup/delivery')
  async signupDelivery(@Body() data: SignupClientDto, @Res() res: Response) {
    const user = await this.authService.signupDelivery(data);

    if (!user.success)
      return res.json({
        success: user.success,
        message: user.message,
        status: user.status,
      });

    res.cookie('refresh_token', user.data.refresh_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: user.success,
      message: user.message,
      status: user.status,
      data: user.data.access_token,
    });
  }

  @Post('post/signup/client')
  async signUpClient(@Body() data: SignupClientDto, @Res() res: Response) {
    const user = await this.authService.signUpClient(data);

    if (!user.success)
      return res.json({
        success: user.success,
        message: user.message,
        status: user.status,
      });

    res.cookie('refresh_token', user.data.refresh_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: user.success,
      message: user.message,
      status: user.status,
      data: user.data.access_token,
    });
  }

  @Post('post/signup/business')
  async signUpBusiness(@Body() data: SignupBusinessDto, @Res() res: Response) {
    const user = await this.authService.signUpBusiness(data);
    if (!user.success)
      return res.json({
        success: user.success,
        message: user.message,
        status: user.status,
      });

    res.cookie('refresh_token', user.data.refresh_token, {
      httpOnly: false,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: user.success,
      message: user.message,
      status: user.status,
      data: user.data.access_token,
    });
  }
}
