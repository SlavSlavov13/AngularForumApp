import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { selfRedirectGuard } from './self-redirect-guard';

describe('selfRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => selfRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
