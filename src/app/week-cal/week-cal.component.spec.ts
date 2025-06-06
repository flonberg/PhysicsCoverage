import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekCalComponent } from './week-cal.component';

describe('WeekCalComponent', () => {
  let component: WeekCalComponent;
  let fixture: ComponentFixture<WeekCalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekCalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WeekCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
