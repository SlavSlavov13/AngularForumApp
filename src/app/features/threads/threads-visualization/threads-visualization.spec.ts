import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadsVisualization } from './threads-visualization';

describe('ThreadsVisualization', () => {
  let component: ThreadsVisualization;
  let fixture: ComponentFixture<ThreadsVisualization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadsVisualization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadsVisualization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
