import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/skipAuth.decorator';
import { IS_ADJUSTER_KEY, IS_ADMIN_KEY, IS_DRIVER_KEY, IS_SUPPORT_EXECUTIVE_KEY } from 'src/roleAuth.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService, private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {

        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = await this.jwtService.verifyAsync(token);
            request.user = payload;

            const userRole = payload.role;

            const hasCorrectRole = this.userHasSpecifiedRole(userRole, context);
            if(!hasCorrectRole){
                throw new UnauthorizedException();
            }

            const expirationTime = payload.exp * 1000;
            const currentTime = Date.now();
            const timeUntilExpiration = expirationTime - currentTime;

            /*if (timeUntilExpiration <= 5 * 60 * 1000) {
              const newToken = this.authService.generateJwt(payload.email, userRole);
              response.setHeader('New-Access-Token', newToken.token);
            }*/

            return true;

        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    userHasSpecifiedRole(userRole: string, context: ExecutionContext) {
        const needsRoleDriver = this.reflector.getAllAndOverride<boolean>(IS_DRIVER_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (needsRoleDriver && userRole == "Conductor") {
            return true;
        }

        const needsRoleAdjuster = this.reflector.getAllAndOverride<boolean>(IS_ADJUSTER_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (needsRoleAdjuster && userRole == "Ajustador") {
            return true;
        }

        const needsRoleSupportExecutive = this.reflector.getAllAndOverride<boolean>(IS_SUPPORT_EXECUTIVE_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (needsRoleSupportExecutive && userRole == "Ejecutivo de asistencia") {
            return true;
        }

        const needsRoleAdmin = this.reflector.getAllAndOverride<boolean>(IS_ADMIN_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (needsRoleAdmin && userRole == "Administrador") {
            return true;
        }

        if(!needsRoleAdjuster && !needsRoleDriver && !needsRoleAdmin && !needsRoleSupportExecutive){
            return true;
        }
        return false;
    }
}
