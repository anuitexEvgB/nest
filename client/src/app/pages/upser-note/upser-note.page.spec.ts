import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpserNotePage } from './upser-note.page';

describe('UpserNotePage', () => {
  let component: UpserNotePage;
  let fixture: ComponentFixture<UpserNotePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpserNotePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpserNotePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
