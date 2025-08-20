import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ThreadCreate} from './thread-create';
import {ReactiveFormsModule} from '@angular/forms';
import {ThreadService} from '../../../core/services/thread.service';
import {AuthService} from '../../../core/services/auth.service';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {DocumentReference} from '@angular/fire/firestore';

describe('ThreadCreate', () => {
	let component: ThreadCreate;
	let fixture: ComponentFixture<ThreadCreate>;
	let threadServiceMock: any;
	let authServiceMock: any;
	let routerMock: any;
	let locationMock: any;

	beforeEach(async () => {
		threadServiceMock = {
			createThread: jasmine.createSpy('createThread'),
		};

		authServiceMock = {
			currentUid: jasmine.createSpy('currentUid').and.returnValue(Promise.resolve('user123')),
		};

		routerMock = {
			navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
		};

		locationMock = {
			back: jasmine.createSpy('back'),
		};

		await TestBed.configureTestingModule({
			imports: [ThreadCreate, ReactiveFormsModule],
			providers: [
				{provide: ThreadService, useValue: threadServiceMock},
				{provide: AuthService, useValue: authServiceMock},
				{provide: Router, useValue: routerMock},
				{provide: Location, useValue: locationMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ThreadCreate);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('form invalid when empty', () => {
		expect((component as any).form.valid).toBeFalse();
	});

	it('should markAllAsTouched and not submit if form invalid', async () => {
		spyOn((component as any).form, 'markAllAsTouched');
		await (component as any).submit();
		expect((component as any).form.markAllAsTouched).toHaveBeenCalled();
		expect(threadServiceMock.createThread).not.toHaveBeenCalled();
	});

	it('should submit form, call createThread, reset form and navigate on success', fakeAsync(() => {
		(component as any).form.controls['title'].setValue('Thread title');
		(component as any).form.controls['body'].setValue('This is a sufficiently long thread body content');
		(component as any).form.controls['tags'].setValue(' angular, typescript ');

		const docRefMock = {id: 'thread123'} as DocumentReference;
		threadServiceMock.createThread.and.returnValue(Promise.resolve(docRefMock));

		(component as any).submit();

		expect((component as any).creating).toBeTrue();

		tick();

		expect(authServiceMock.currentUid).toHaveBeenCalled();
		expect(threadServiceMock.createThread).toHaveBeenCalledWith({
			title: 'Thread title',
			body: 'This is a sufficiently long thread body content',
			tags: ['angular', 'typescript'],
			authorId: 'user123',
		});
		expect((component as any).form.value.title).toBeNull(); // after reset
		expect(routerMock.navigate).toHaveBeenCalledWith(['/threads/thread123']);
		expect((component as any).creating).toBeFalse();
	}));

	it('should set error on submit failure', fakeAsync(() => {
		(component as any).form.controls['title'].setValue('Thread title');
		(component as any).form.controls['body'].setValue('This is a sufficiently long thread body content');
		(component as any).form.controls['tags'].setValue('');

		threadServiceMock.createThread.and.returnValue(Promise.reject('Error'));

		(component as any).submit().catch(() => {
		});

		tick();

		expect((component as any).error).toBeDefined();
		expect((component as any).creating).toBeFalse();
	}));

	it('should call location.back on onCancel', () => {
		(component as any).onCancel();
		expect(locationMock.back).toHaveBeenCalled();
	});
});
