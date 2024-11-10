import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.usersService.signIn(email);

        if (user?.password !== password) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.email };

        return {
            access_token: this.generateJwt(payload)
        };

    }

    public generateJwt(payload: any) {
        return this.jwtService.sign(payload);
      }

}
