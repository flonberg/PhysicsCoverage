import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResTriageComponent } from './res-triage.component';

describe('ResTriageComponent', () => {
  let component: ResTriageComponent;
  let fixture: ComponentFixture<ResTriageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResTriageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResTriageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
