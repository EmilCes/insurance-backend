export class CreatePolicyPlanDto {
    title: string;
    description: string;
    maxPeriod: number;
    basePrice: number;
    service: {
        name: string;
        isCovered: boolean;
        coveredCost: number;
    }[];
}