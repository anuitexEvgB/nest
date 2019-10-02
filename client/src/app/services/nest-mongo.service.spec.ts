import { TestBed } from '@angular/core/testing';

import { NestMongoService } from './nest-mongo.service';

describe('NestMongoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NestMongoService = TestBed.get(NestMongoService);
    expect(service).toBeTruthy();
  });
});
