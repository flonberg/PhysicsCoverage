import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngtimeawayComponent } from './angtimeaway.component';

describe('AngtimeawayComponent', () => {
  let component: AngtimeawayComponent;
  let fixture: ComponentFixture<AngtimeawayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngtimeawayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AngtimeawayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
