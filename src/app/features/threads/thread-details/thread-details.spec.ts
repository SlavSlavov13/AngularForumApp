import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadDetails } from './thread-details';

describe('ThreadDetails', () => {
  let component: ThreadDetails;
  let fixture: ComponentFixture<ThreadDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThreadDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThreadDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
