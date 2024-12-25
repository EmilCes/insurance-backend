export const state = [
    {idState: 1, stateName: "Veracruz" }
]

export const municipality = [
    { idMunicipality: 1, municipalityName: "Xalapa", idState: 1}
]

export const drivers = [
    { rfc: "12345678901234", bankAccountNumber: "1234567890123456789", expirationDateBankAccount: new Date("2050-12-12"), 
        licenseNumber: "12345678901234567890", phone: "2281937492", idUser: 1}
]

export const account = [
    {name: "Jacob", lastName: "Montiel", datebirth: new Date("2002-12-12"), email: "jacob@gmail.com", password: "123", registrationDate: new Date("2002-12-12"), 
        postalCode: "91020", address: "Calle 1234", idAccount: 1, idMunicipality: 1, idUser: 1
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

export const policyPlanStatus = [
    { idPolicyPlanStatus: 1, policyPlanStatusType: "Vigente" },
    { idPolicyPlanStatus: 2, policyPlanStatusType: "No vigente" }
]

export const policyPlans = [
    { idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8", title: "Amplia Plus", description: "Cubre la Responsabilidad Civil, Asistencia Legal, Gastos médicos a ocupantes, Robo Total, Daños Materiales y otras coberturas y beneficios adicionales",
        maxPeriod: 12, basePrice: 17558, idPolicyPlanStatus: 1
    },
    { idPolicyPlan: "4bed19ff-ed0c-48c7-bea3-003b3b83177b", title: "Amplia", description: "Cubre la Responsabilidad Civil, Asistencia Legal, Gastos médicos a ocupantes, Robo Total y Daños Materiales",
        maxPeriod: 6, basePrice: 15558, idPolicyPlanStatus: 1
    },
    { idPolicyPlan: "97cdcf01-90f2-4301-9fdd-d9d0be9f2101", title: "Limitada", description: "Cubre la Responsabilidad Civil, Asistencia Legal, Gastos médicos a ocupantes y Robo Total",
        maxPeriod: 4, basePrice: 12558, idPolicyPlanStatus: 1
    },
    { idPolicyPlan: "f149d3c7-d06a-4a7a-becd-ca043d5e2608", title: "Responsabilidad Civil", description: "Cubre la Responsabilidad Civil, Asistencia Legal y Gastos médicos a ocupantes",
        maxPeriod: 2, basePrice: 10558, idPolicyPlanStatus: 2
    }
]

export const policyPlansServices = [
    { idService: 1, name: "Daños materiales", isCovered: false, coveredCost: 105000, idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8"},
    { idService: 2, name: "Robo total", isCovered: false, coveredCost: 105000, idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8"},
    { idService: 3, name: "Responsivilidad civil", isCovered: false, coveredCost: 3000000, idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8"},
    { idService: 4, name: "Gastos legales", isCovered: true, coveredCost: 0, idPolicyPlan: "a09be575-f839-4ba1-bfd9-e64c3f59e1b8"},
    { idService: 5, name: "Daños materiales", isCovered: false, coveredCost: 5000, idPolicyPlan: "4bed19ff-ed0c-48c7-bea3-003b3b83177b"},
    { idService: 6, name: "Robo total", isCovered: false, coveredCost: 5000, idPolicyPlan: "4bed19ff-ed0c-48c7-bea3-003b3b83177b"},
    { idService: 7, name: "Responsivilidad civil", isCovered: false, coveredCost: 200000, idPolicyPlan: "4bed19ff-ed0c-48c7-bea3-003b3b83177b"},
    { idService: 8, name: "Daños materiales", isCovered: false, coveredCost: 3000, idPolicyPlan: "97cdcf01-90f2-4301-9fdd-d9d0be9f2101"},
    { idService: 9, name: "Robo total", isCovered: false, coveredCost: 3000, idPolicyPlan: "97cdcf01-90f2-4301-9fdd-d9d0be9f2101"},
    { idService: 10, name: "Daños materiales", isCovered: false, coveredCost: 200, idPolicyPlan: "f149d3c7-d06a-4a7a-becd-ca043d5e2608"}
]

export const brands = [
    { idBrand: 1, name: "BMW"},
    { idBrand: 2, name: "Ford"},
    { idBrand: 3, name: "Suzuki"},
    { idBrand: 4, name: "Saturn"},
    { idBrand: 5, name: "Nissan"}
]

export const models = [
    { idModel: 1, year: "2020", idBrand: 1},
    { idModel: 6, year: "2019", idBrand: 1},
    { idModel: 7, year: "2018", idBrand: 1},
    { idModel: 2, year: "2020", idBrand: 2},
    { idModel: 3, year: "2020", idBrand: 3},
    { idModel: 4, year: "2020", idBrand: 4},
    { idModel: 5, year: "2020", idBrand: 5}
]