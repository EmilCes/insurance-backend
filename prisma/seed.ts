import { PrismaClient } from "@prisma/client";
import { state, municipality, drivers, account, colors, type, serviceVehicle, policyPlanStatus, policyPlans, policyPlansServices, brands, models, employeeType, employee, vehicle, policies, policyServices, status } from "./modelsSeed";

const prisma = new PrismaClient();

async function main() {

    await prisma.photograph.deleteMany({});
    await prisma.implicateParty.deleteMany({});
    await prisma.report.deleteMany({});
    await prisma.policyService.deleteMany({});
    await prisma.policy.deleteMany({});
    await prisma.vehicle.deleteMany({});
    await prisma.service.deleteMany({});
    await prisma.policyPlan.deleteMany({});
    await prisma.policyPlanStatus.deleteMany({});
    await prisma.serviceVehicle.deleteMany({});
    await prisma.type.deleteMany({});
    await prisma.color.deleteMany({});
    await prisma.employee.deleteMany({});
    await prisma.account.deleteMany({});
    await prisma.driver.deleteMany({});
    await prisma.municipality.deleteMany({});
    await prisma.state.deleteMany({});
    await prisma.model.deleteMany({});
    await prisma.brand.deleteMany({});
    await prisma.employeeType.deleteMany({});
    await prisma.status.deleteMany({});

    for (let item of status) {
        await prisma.status.create({
            data: item
        });
    }

    for (let item of employeeType) {
        await prisma.employeeType.create({
            data: item,
        });
    }

    for (let item of status) {
        await prisma.status.create({
            data: item,
        });
    }

    for (let item of brands) {
        await prisma.brand.create({
            data: item,
        });
    }

    for (let item of models) {
        await prisma.model.create({
            data: item,
        });
    }
    
    for (let item of state) {
        await prisma.state.create({
            data: item,
        });
    }

    for (let item of municipality) {
        await prisma.municipality.create({
            data: item,
        });
    }

    for (let item of drivers) {
        await prisma.driver.create({
            data: item,
        });
    }

    for (let item of account) {
        await prisma.account.create({
            data: item,
        });
    }

    for (let item of colors) {
        await prisma.color.create({
            data: item,
        });
    }

    for (let item of type) {
        await prisma.type.create({
            data: item,
        });
    }

    for (let item of serviceVehicle) {
        await prisma.serviceVehicle.create({
            data: item,
        });
    }

    for (let item of policyPlanStatus) {
        await prisma.policyPlanStatus.create({
            data: item,
        });
    }

    for (let item of policyPlans) {
        await prisma.policyPlan.create({
            data: item,
        });
    }

    for (let item of policyPlansServices) {
        await prisma.service.create({
            data: item,
        });
    }

    for (let item of vehicle) {
        await prisma.vehicle.create({
            data: item,
        });
    }

    for (let item of policies) {
        await prisma.policy.create({
            data: item,
        });
    }

    for (let item of policyServices) {
        await prisma.policyService.create({
            data: item,
        });
    }

    for (let item of employee) {
        await prisma.employee.create({
            data: item,
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => {
        prisma.$disconnect();
    });
