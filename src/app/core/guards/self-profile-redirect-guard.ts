import {CanActivateFn} from '@angular/router';

export const selfProfileRedirectGuard: CanActivateFn = (route, state) => {
	return true;
};
