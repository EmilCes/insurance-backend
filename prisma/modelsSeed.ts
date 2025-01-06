export const employeeType = [
    { idEmployeeType: 1, employeeType: "Administrador" },
    { idEmployeeType: 2, employeeType: "Ejecutivo de asistencia" },
    { idEmployeeType: 3, employeeType: "Ajustador" }
]

export const employee = [
    { idEmployee: 1, employeeNumber: 1, idEmployeeType: 1 },
    { idEmployee: 2, employeeNumber: 2, idEmployeeType: 3 }
]

export const state = [
    { idState: 1, stateName: "Veracruz" },
    { idState: 2, stateName: "Puebla" }
]

export const municipality = [
    { idMunicipality: 1, municipalityName: "Xalapa", idState: 1 },
    { idMunicipality: 2, municipalityName: "Puebla", idState: 2 }
]

export const drivers = [
    {
        rfc: "12345678901234", bankAccountNumber: "1234567890123456789", expirationDateBankAccount: new Date("2050-12-12"),
        licenseNumber: "12345678901234567890", phone: "2281937492", idUser: 1
    },
    {
        rfc: "098765432345", bankAccountNumber: "0987654323456788", expirationDateBankAccount: new Date("2050-12-12"),
        licenseNumber: "68g68g8608686", phone: "2244554336", idUser: 2
    }
]

export const account = [
    {
        name: "Jacob", lastName: "Montiel", datebirth: new Date("2002-12-12"), email: "jacob@gmail.com", password: "12345678", registrationDate: new Date("2002-12-12"),
        postalCode: "91020", address: "Calle 1234", idAccount: 1, idMunicipality: 1, idUser: 1
    },
    {
        name: "Sulem", lastName: "M", datebirth: new Date("2003-12-12"), email: "sulem@gmail.com", password: "12345678", registrationDate: new Date("2012-12-12"),
        postalCode: "91020", address: "Calle 4321", idAccount: 2, idMunicipality: 1, idUser: 2
    },
    {
        name: "Admin", lastName: "Admin", datebirth: new Date("2001-12-12"), email: "admin@gmail.com", password: "12345678", registrationDate: new Date("2014-12-12"),
        postalCode: "91020", address: "Calle 78237", idAccount: 3, idMunicipality: 1, idEmployee: 1
    },
    {
        name: "César", lastName: "Lezama", datebirth: new Date("2003-12-12"), email: "e@a.com", password: "12345678", registrationDate: new Date("2012-12-12"),
        postalCode: "91020", address: "Calle 4321", idAccount: 4, idMunicipality: 1, idEmployee: 2
    }
]

export const colors = [
    { idColor: 1, vehicleColor: "Azul" },
    { idColor: 2, vehicleColor: "Rojo" },
    { idColor: 3, vehicleColor: "Amarillo" },
    { idColor: 4, vehicleColor: "Negro" },
    { idColor: 5, vehicleColor: "Gris" },
    { idColor: 6, vehicleColor: "Blanco" }
]

export const type = [
    { idType: 1, vehicleType: "Automoviles importados" },
    { idType: 2, vehicleType: "Automoviles exportados" }
]

export const serviceVehicle = [
    { idService: 1, name: "Particular" },
    { idService: 2, name: "Comercial" }
]

export const status = [
    { idStatus: 1, statusType: "Pendiente"},
    { idStatus: 2, statusType: "Dictaminado"},
]

export const policyPlanStatus = [
    { idPolicyPlanStatus: 1, policyPlanStatusType: "Vigente" },
    { idPolicyPlanStatus: 2, policyPlanStatusType: "No vigente" }
]

export const policyPlans = [
    {
        idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8", title: "Amplia Plus", description: "Cubre la Responsabilidad Civil, Asistencia Legal, Gastos médicos a ocupantes, Robo Total, Daños Materiales y otras coberturas y beneficios adicionales",
        maxPeriod: 12, basePrice: 17558, idPolicyPlanStatus: 1
    },
    {
        idPolicyPlan: "4bed19ff-ed0c-48c7-bea3-003b3b83177b", title: "Amplia", description: "Cubre la Responsabilidad Civil, Asistencia Legal, Gastos médicos a ocupantes, Robo Total y Daños Materiales",
        maxPeriod: 6, basePrice: 15558, idPolicyPlanStatus: 1
    },
    {
        idPolicyPlan: "97cdcf01-90f2-4301-9fdd-d9d0be9f2101", title: "Limitada", description: "Cubre la Responsabilidad Civil, Asistencia Legal, Gastos médicos a ocupantes y Robo Total",
        maxPeriod: 4, basePrice: 12558, idPolicyPlanStatus: 1
    },
    {
        idPolicyPlan: "f149d3c7-d06a-4a7a-becd-ca043d5e2608", title: "Responsabilidad Civil", description: "Cubre la Responsabilidad Civil, Asistencia Legal y Gastos médicos a ocupantes",
        maxPeriod: 2, basePrice: 10558, idPolicyPlanStatus: 2
    }
]

export const policyPlansServices = [
    { idService: 1, name: "Daños materiales", isCovered: false, coveredCost: 105000, idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8" },
    { idService: 2, name: "Robo total", isCovered: false, coveredCost: 105000, idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8" },
    { idService: 3, name: "Responsivilidad civil", isCovered: false, coveredCost: 3000000, idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8" },
    { idService: 4, name: "Gastos legales", isCovered: true, coveredCost: 0, idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8" },
    { idService: 5, name: "Daños materiales", isCovered: false, coveredCost: 5000, idPolicyPlan: "4bed19ff-ed0c-48c7-bea3-003b3b83177b" },
    { idService: 6, name: "Robo total", isCovered: false, coveredCost: 5000, idPolicyPlan: "4bed19ff-ed0c-48c7-bea3-003b3b83177b" },
    { idService: 7, name: "Responsivilidad civil", isCovered: false, coveredCost: 200000, idPolicyPlan: "4bed19ff-ed0c-48c7-bea3-003b3b83177b" },
    { idService: 8, name: "Daños materiales", isCovered: false, coveredCost: 3000, idPolicyPlan: "97cdcf01-90f2-4301-9fdd-d9d0be9f2101" },
    { idService: 9, name: "Robo total", isCovered: false, coveredCost: 3000, idPolicyPlan: "97cdcf01-90f2-4301-9fdd-d9d0be9f2101" },
    { idService: 10, name: "Daños materiales", isCovered: false, coveredCost: 200, idPolicyPlan: "f149d3c7-d06a-4a7a-becd-ca043d5e2608" }
]

export const brands = [
    { idBrand: 1, name: "BMW" },
    { idBrand: 2, name: "Ford" },
    { idBrand: 3, name: "Suzuki" },
    { idBrand: 4, name: "Saturn" },
    { idBrand: 5, name: "Nissan" }
]

export const models = [
    { idModel: 1, year: "2020", idBrand: 1 },
    { idModel: 6, year: "2019", idBrand: 1 },
    { idModel: 7, year: "2018", idBrand: 1 },
    { idModel: 2, year: "2020", idBrand: 2 },
    { idModel: 3, year: "2020", idBrand: 3 },
    { idModel: 4, year: "2020", idBrand: 4 },
    { idModel: 5, year: "2020", idBrand: 5 }
]

export const vehicle = [
    { plates: "AAA-01-01", serialNumberVehicle: "97232176545678", occupants: 3, idService: 1, idType: 1, idModel: 1, idColor: 1 }
]

export const policies = [
    {
        serialNumber: "0cafd594-2186-4f3a-851d-9ef334e3acaa", monthsOfPayment: 4, yearsPolicy: 3, isCanceled: false, coveredCost: 12330,
        startDate: new Date("2024-12-12"), planTitle: "Limitada", planDescription: "Cubre la Responsabilidad Civil, Asistencia Legal, Gastos médicos a ocupantes y Robo Total",
        idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8", plates: "AAA-01-01", idUser: 1
    }
]

export const policyServices = [
    {  idPolicyService: 1, name: "Daños materiales", isCovered: false, coveredCost: 3000, serialNumber: "0cafd594-2186-4f3a-851d-9ef334e3acaa"},
    {  idPolicyService: 2, name: "Robo total", isCovered: false, coveredCost: 4000, serialNumber: "0cafd594-2186-4f3a-851d-9ef334e3acaa"}
]