import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonepalComponent } from './phonepal.component';

describe('PhonepalComponent', () => {
  let component: PhonepalComponent;
  let fixture: ComponentFixture<PhonepalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhonepalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonepalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
