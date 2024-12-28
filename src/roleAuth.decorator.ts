
import { SetMetadata } from '@nestjs/common';

export const IS_DRIVER_KEY = 'isDriver';
export const RoleDriver = () => SetMetadata(IS_DRIVER_KEY, true);

export const IS_ADJUSTER_KEY = 'isAdjuster';
export const RoleAdjuster = () => SetMetadata(IS_ADJUSTER_KEY, true);

export const IS_SUPPORT_EXECUTIVE_KEY = 'isSupportExecutive';
export const RoleSupportExecutive = () => SetMetadata(IS_SUPPORT_EXECUTIVE_KEY, true);

export const IS_ADMIN_KEY = 'isAdmin';
export const RoleAdmin = () => SetMetadata(IS_ADMIN_KEY, true);
