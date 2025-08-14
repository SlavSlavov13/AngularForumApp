import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { selfThreadRedirectGuard } from './self-thread-redirect-guard';

describe('selfThreadRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => selfThreadRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
