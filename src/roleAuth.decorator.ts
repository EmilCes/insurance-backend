import { SetMetadata } from '@nestjs/common';

export const IS_DRIVER_KEY = 'roles:driver';
export const RoleDriver = () => SetMetadata(IS_DRIVER_KEY, ['Conductor']);

export const IS_ADJUSTER_KEY = 'roles:adjuster';
export const RoleAdjuster = () => SetMetadata(IS_ADJUSTER_KEY, ['Ajustador']);

export const IS_SUPPORT_EXECUTIVE_KEY = 'roles:supportExecutive';
export const RoleSupportExecutive = () => SetMetadata(IS_SUPPORT_EXECUTIVE_KEY, ['Ejecutivo de asistencia']);

export const IS_ADMIN_KEY = 'roles:admin';
export const RoleAdmin = () => SetMetadata(IS_ADMIN_KEY, ['Administrador']);
