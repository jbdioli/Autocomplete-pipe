import { TestBed } from '@angular/core/testing';

import { CoreStorageService } from './core-storage.service';

describe('CoreStorageService', () => {
  let service: CoreStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CoreStorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
