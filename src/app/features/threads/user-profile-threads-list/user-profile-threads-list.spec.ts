import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileThreadsList } from './user-profile-threads-list';

describe('UserProfileThreadsList', () => {
  let component: UserProfileThreadsList;
  let fixture: ComponentFixture<UserProfileThreadsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileThreadsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileThreadsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
