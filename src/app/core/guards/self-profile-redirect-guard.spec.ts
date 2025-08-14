import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { selfProfileRedirectGuard } from './self-profile-redirect-guard';

describe('selfProfileRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => selfProfileRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
