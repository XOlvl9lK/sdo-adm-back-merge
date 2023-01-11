import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '@modules/user/application/auth.service';
import { LoginDto } from '@modules/user/controllers/dtos/login.dto';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '@modules/user/infrastructure/guards/jwt-auth.guard';
import { UserId } from '@core/libs/user-id.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { access_token, session } = await this.authService.login(loginDto);
    res.cookie('refresh_token', session.refresh_token, { httpOnly: true });
    return res.json({ access_token });
  }

  @Post('forceLogin')
  async forceLogin(@Body() loginDto: LoginDto, @Res() res: Response) {
    const { access_token, session } = await this.authService.login(loginDto, true);
    this.authService.setCookie(res, session);
    return res.json({ access_token });
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@UserId() userId: string) {
    return await this.authService.logout(userId);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res() res: Response) {
    try {
      const { access_token, session } = await this.authService.refresh(req.cookies.refresh_token);
      this.authService.setCookie(res, session);
      return res.json({ access_token });
    } catch (e) {
      res.clearCookie('refresh_token');
      res.status(401).end();
    }
  }
}
