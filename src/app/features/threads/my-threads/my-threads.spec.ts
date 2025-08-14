import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyThreads } from './my-threads';

describe('MyThreads', () => {
  let component: MyThreads;
  let fixture: ComponentFixture<MyThreads>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyThreads]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyThreads);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
