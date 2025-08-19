import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsVisualization } from './posts-visualization';

describe('PostsVisualization', () => {
  let component: PostsVisualization;
  let fixture: ComponentFixture<PostsVisualization>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostsVisualization]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostsVisualization);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
