import { Body, Controller, HttpCode, HttpStatus, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from 'src/skipAuth.decorator';
import { JwtAuthGuard } from './jwt.auth.guard';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService
    ) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    async signIn(@Body() signInDto: Record<string, any>) {
        const isCodeValid =
            this.authService.isTwoFactorAuthenticationCodeValid(
                signInDto.twoFactorAuthenticationCode,
                signInDto.email,
            );

        if (await isCodeValid === false) {
            throw new UnauthorizedException('Wrong authentication code');
        }

        return this.authService.signIn(signInDto.email, signInDto.password, signInDto.code);
    }

    @Public()
    @Post('2fa/enabled')
    async is2faEnabled(@Req() req, @Body() body: Record<string, any>) {
        return this.usersService.is2faEnabled(body.email);
    }

    @Public()
    @Post('2fa/generate')
    async generateTwoFactorAuthentication(@Body() generateDto: Record<string, any>) {
        return this.authService.generateTwoFactorAuthenticationSecret(generateDto.email, generateDto.password);
    }

    @Public()
    @Post('2fa/turn-on')
    async turnOnTwoFactorAuthentication(@Body() turnOnDto: Record<string, any>) {
        const isCodeValid =
            this.authService.isTwoFactorAuthenticationCodeValid(
                turnOnDto.twoFactorAuthenticationCode,
                turnOnDto.email,
            );
        if (await isCodeValid === false) {
            throw new UnauthorizedException('Wrong authentication code');
        }

        await this.usersService.turnOnTwoFactorAuthentication(turnOnDto.email);

        return this.authService.firstSignIn(turnOnDto.email, turnOnDto.twoFactorAuthenticationCode);
    }
}
