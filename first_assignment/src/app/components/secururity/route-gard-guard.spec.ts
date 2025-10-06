import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { routeGardGuard } from './route-gard-guard';

describe('routeGardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => routeGardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
