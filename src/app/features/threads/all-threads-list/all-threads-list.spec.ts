import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllThreadsList } from './all-threads-list';

describe('AllThreadsList', () => {
  let component: AllThreadsList;
  let fixture: ComponentFixture<AllThreadsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllThreadsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllThreadsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
