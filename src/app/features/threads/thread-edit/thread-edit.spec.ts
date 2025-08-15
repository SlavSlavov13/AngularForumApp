import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ThreadEdit} from './thread-edit';

describe('ThreadEdit', () => {
	let component: ThreadEdit;
	let fixture: ComponentFixture<ThreadEdit>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ThreadEdit]
		})
			.compileComponents();

		fixture = TestBed.createComponent(ThreadEdit);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
