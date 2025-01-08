import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { authenticator } from 'otplib';
import { EmployeeService } from 'src/employee/employee.service';
import { UsersService } from 'src/users/users.service';
import { toDataURL } from 'qrcode';

@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private employeeService: EmployeeService,
        private jwtService: JwtService
    ) { }

    async signIn(email: string, password: string): Promise<any> {
        const user = await this.usersService.signIn(email);

        if (user?.password !== password) {
            throw new UnauthorizedException();
        }

        const role = (user.idEmployee ? await this.employeeService.getTypeEmployee(user.idEmployee) : "Conductor");
        if (!role) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.idAccount, username: user.email, role: role };

        return {
            access_token: this.generateJwt(payload)
        };

    }

    async firstSignIn(email: string){
        const user = await this.usersService.signIn(email);

        const role = (user.idEmployee ? await this.employeeService.getTypeEmployee(user.idEmployee) : "Conductor");
        if (!role) {
            throw new UnauthorizedException();
        }

        const payload = { sub: user.idAccount, username: user.email, role: role };

        return {
            access_token: this.generateJwt(payload)
        };

    }

    async generateTwoFactorAuthenticationSecret(email: string, password: string) {

        const user = await this.usersService.signIn(email);

        if (user?.password !== password) {
            throw new UnauthorizedException();
        }

        const secret = authenticator.generateSecret();

        const otpauthUrl = authenticator.keyuri(user.email, 'Accidentes UViales', secret);

        await this.usersService.setTwoFactorAuthenticationSecret(secret, email);

        return {
            secret,
            otpauthUrl
        }
    }

    async generateQrCodeDataURL(otpAuthUrl: string) {
        return toDataURL(otpAuthUrl);
    }

    public generateJwt(payload: { sub: number, username: string, role: string }) {
        return this.jwtService.sign(payload);
    }

    async isTwoFactorAuthenticationCodeValid(twoFactorAuthenticationCode: string, email: string) {
        const user = await this.usersService.signIn(email);

        return authenticator.verify({
            token: twoFactorAuthenticationCode,
            secret: user.secretKey,
        });
    }

}
