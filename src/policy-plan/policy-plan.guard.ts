import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class PolicyPlanGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const method = request.method;
        const body = request.body;
        const params = request.params;
        if (method === "POST") {
            return this.validarPostRequest(body);
        } else if (method === "GET") {
            if ('id' in params) {
                const id = params.id;
                if (!id || isNaN(Number(id))) {
                    return false;
                }
                return true; 
            }
            return true;
        } else {
            return false
        }
    }

    private validarPostRequest(body: any): boolean {
        const requiredFields = ['title', 'description', 'maxPeriod', 'basePrice', 'service'];
        for (const field of requiredFields) {
            if (!(field in body)) {
                return false;
            }
        }
        if (typeof body.title !== 'string' || typeof body.description !== 'string' || typeof body.maxPeriod !== 'number' ||
            typeof body.basePrice !== 'number' || body.basePrice < 0 || body.maxPeriod < 0 || !Array.isArray(body.service)) {
            return false;
        }
        if (body.title.length > 30 || body.description.length > 255 || body.maxPeriod < 0 ||
            !/^\d+(\.\d{1,2})?$/.test(body.basePrice.toString())) {
            return false;
        }

        for (const service of body.service) {
            if (typeof service.name !== 'string' || service.name.trim() === '' || typeof service.isCovered !== 'boolean' ||
                typeof service.coveredCost !== 'number' || service.coveredCost < 0 || !/^\d+(\.\d{1,2})?$/.test(service.coveredCost.toString())
            ) {
                return false;
            }
        }

        return true;
    }
}