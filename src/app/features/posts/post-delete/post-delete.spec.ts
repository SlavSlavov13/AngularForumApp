import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostDelete } from './post-delete';

describe('PostDelete', () => {
  let component: PostDelete;
  let fixture: ComponentFixture<PostDelete>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostDelete]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostDelete);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
