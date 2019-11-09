import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidateuserComponent } from './validateuser.component';

describe('ValidateuserComponent', () => {
  let component: ValidateuserComponent;
  let fixture: ComponentFixture<ValidateuserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidateuserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidateuserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
