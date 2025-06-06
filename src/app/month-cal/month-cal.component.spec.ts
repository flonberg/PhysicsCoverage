import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthCalComponent } from './month-cal.component';

describe('MonthCalComponent', () => {
  let component: MonthCalComponent;
  let fixture: ComponentFixture<MonthCalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MonthCalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MonthCalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
