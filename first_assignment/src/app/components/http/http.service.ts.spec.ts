import { TestBed } from '@angular/core/testing';

import { HttpServiceTs } from './http.service.ts';

describe('HttpServiceTs', () => {
  let service: HttpServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
