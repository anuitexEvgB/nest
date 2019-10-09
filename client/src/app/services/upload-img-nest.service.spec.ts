import { TestBed } from '@angular/core/testing';

import { UploadImgNestService } from './upload-img-nest.service';

describe('UploadImgNestService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UploadImgNestService = TestBed.get(UploadImgNestService);
    expect(service).toBeTruthy();
  });
});
