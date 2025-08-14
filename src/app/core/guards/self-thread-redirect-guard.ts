import { CanActivateFn } from '@angular/router';

export const selfThreadRedirectGuard: CanActivateFn = (route, state) => {
  return true;
};
