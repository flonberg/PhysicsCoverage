import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MydutiesComponent } from './myduties.component';

describe('MydutiesComponent', () => {
  let component: MydutiesComponent;
  let fixture: ComponentFixture<MydutiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MydutiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MydutiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
