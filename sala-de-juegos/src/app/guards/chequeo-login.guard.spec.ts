import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { chequeoLoginGuard } from './chequeo-login.guard';

describe('chequeoLoginGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => chequeoLoginGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
