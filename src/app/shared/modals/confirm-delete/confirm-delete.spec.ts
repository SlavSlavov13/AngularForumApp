import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ConfirmDelete} from './confirm-delete';
import {DIALOG_DATA, DialogRef} from '@angular/cdk/dialog';

describe('ConfirmDelete', () => {
	let component: ConfirmDelete;
	let fixture: ComponentFixture<ConfirmDelete>;
	let dialogRefSpy: jasmine.SpyObj<DialogRef>;

	beforeEach(async () => {
		dialogRefSpy = jasmine.createSpyObj('DialogRef', ['close']);

		await TestBed.configureTestingModule({
			imports: [ConfirmDelete],
			providers: [
				{provide: DialogRef, useValue: dialogRefSpy},
				{provide: DIALOG_DATA, useValue: { /* mock ConfirmDeleteData if needed */}},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ConfirmDelete);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should close dialog with true when onConfirm is called', () => {
		component.onConfirm();
		expect(dialogRefSpy.close).toHaveBeenCalledWith(true);
	});

	it('should close dialog with false when onCancel is called', () => {
		component.onCancel();
		expect(dialogRefSpy.close).toHaveBeenCalledWith(false);
	});
});
