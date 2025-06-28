import { TestBed } from '@angular/core/testing';

import { LoginHistory } from './login-history';

describe('LoginHistory', () => {
  let service: LoginHistory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginHistory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
