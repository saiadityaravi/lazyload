import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMemberInteractionComponent } from './dialog-member-interaction.component';

describe('DialogMemberInteractionComponent', () => {
  let component: DialogMemberInteractionComponent;
  let fixture: ComponentFixture<DialogMemberInteractionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogMemberInteractionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMemberInteractionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
