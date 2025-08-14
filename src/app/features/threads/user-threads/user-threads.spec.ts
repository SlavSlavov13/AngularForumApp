import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserThreads } from './user-threads';

describe('UserThreads', () => {
  let component: UserThreads;
  let fixture: ComponentFixture<UserThreads>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserThreads]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserThreads);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
