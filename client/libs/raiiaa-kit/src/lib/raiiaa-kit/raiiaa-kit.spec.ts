import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RaiiaaKit } from './raiiaa-kit';

describe('RaiiaaKit', () => {
  let component: RaiiaaKit;
  let fixture: ComponentFixture<RaiiaaKit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaiiaaKit],
    }).compileComponents();

    fixture = TestBed.createComponent(RaiiaaKit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
