import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { chequeoJuegosGuard } from './chequeo-juegos.guard';

describe('chequeoJuegosGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => chequeoJuegosGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
