import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminUserCalenderComponent } from './admin-user-calender.component';

describe('AdminUserCalenderComponent', () => {
  let component: AdminUserCalenderComponent;
  let fixture: ComponentFixture<AdminUserCalenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminUserCalenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminUserCalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
