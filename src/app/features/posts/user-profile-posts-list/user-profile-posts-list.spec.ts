import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfilePostsList } from './user-profile-posts-list';

describe('UserProfilePostsList', () => {
  let component: UserProfilePostsList;
  let fixture: ComponentFixture<UserProfilePostsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfilePostsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfilePostsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
