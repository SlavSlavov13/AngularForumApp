import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPostsList } from './user-posts-list';

describe('UserPostsList', () => {
  let component: UserPostsList;
  let fixture: ComponentFixture<UserPostsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPostsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPostsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
