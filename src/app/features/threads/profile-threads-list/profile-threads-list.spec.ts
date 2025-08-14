import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileThreadsList } from './profile-threads-list';

describe('ProfileThreadsList', () => {
  let component: ProfileThreadsList;
  let fixture: ComponentFixture<ProfileThreadsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileThreadsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileThreadsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
