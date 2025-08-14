import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { existsGuard } from './exists-guard';

describe('existsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => existsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
