import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserThreadsList } from './user-threads-list';

describe('UserThreadsList', () => {
  let component: UserThreadsList;
  let fixture: ComponentFixture<UserThreadsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserThreadsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserThreadsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
