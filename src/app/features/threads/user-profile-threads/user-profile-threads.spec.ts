import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProfileThreads } from './user-profile-threads';

describe('UserProfileThreads', () => {
  let component: UserProfileThreads;
  let fixture: ComponentFixture<UserProfileThreads>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileThreads]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProfileThreads);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
