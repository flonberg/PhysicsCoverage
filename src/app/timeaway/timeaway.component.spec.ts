import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeawayComponent } from './timeaway.component';

describe('TimeawayComponent', () => {
  let component: TimeawayComponent;
  let fixture: ComponentFixture<TimeawayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeawayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TimeawayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
