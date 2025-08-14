import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadsList } from './threads-list';

describe('ThreadsList', () => {
  let component: ThreadsList;
  let fixture: ComponentFixture<ThreadsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
