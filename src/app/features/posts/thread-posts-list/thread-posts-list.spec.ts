import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadPostsList } from './thread-posts-list';

describe('ThreadPostsList', () => {
  let component: ThreadPostsList;
  let fixture: ComponentFixture<ThreadPostsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadPostsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadPostsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
