import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {ThreadEdit} from './thread-edit';
import {ReactiveFormsModule} from '@angular/forms';
import {ThreadService} from '../../../core/services/thread.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Location} from '@angular/common';
import {of} from 'rxjs';

describe('ThreadEdit', () => {
	let component: ThreadEdit;
	let fixture: ComponentFixture<ThreadEdit>;
	let threadServiceMock: any;
	let activatedRouteMock: any;
	let routerMock: any;
	let storeMock: any;
	let locationMock: any;

	const mockThread = {
		id: 'thread123',
		title: 'Thread Title',
		body: 'This is a sufficiently long body for the thread.',
		tags: ['tag1', 'tag2'],
		authorId: 'user123',
		createdAt: {} as any,
		replyCount: 0,
	};

	beforeEach(async () => {
		threadServiceMock = {
			getThread: jasmine.createSpy('getThread').and.returnValue(Promise.resolve(mockThread)),
			updateThread: jasmine.createSpy('updateThread').and.returnValue(Promise.resolve()),
		};

		activatedRouteMock = {
			snapshot: {
				paramMap: {
					get: jasmine.createSpy('get').and.returnValue('thread123'),
				},
			},
		};

		routerMock = {
			navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
		};

		storeMock = {
			dispatch: jasmine.createSpy('dispatch'),
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		locationMock = {
			back: jasmine.createSpy('back'),
		};

		await TestBed.configureTestingModule({
			imports: [ThreadEdit, ReactiveFormsModule],
			providers: [
				{provide: ThreadService, useValue: threadServiceMock},
				{provide: ActivatedRoute, useValue: activatedRouteMock},
				{provide: Router, useValue: routerMock},
				{provide: Store, useValue: storeMock},
				{provide: Location, useValue: locationMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(ThreadEdit);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create the component', () => {
		expect(component).toBeTruthy();
	});

	it('should load thread and initialize form on ngOnInit', fakeAsync(() => {
		(component as any).ngOnInit();
		tick();

		expect(threadServiceMock.getThread).toHaveBeenCalledWith('thread123');
		const form = (component as any).form;
		expect(form.get('title').value).toBe(mockThread.title);
		expect(form.get('body').value).toBe(mockThread.body);
		expect(form.get('tags').value).toBe('tag1, tag2');
		expect(storeMock.dispatch).toHaveBeenCalledTimes(2); // showLoading + hideLoading
	}));

	it('should set error on ngOnInit failure', fakeAsync(() => {
		threadServiceMock.getThread.and.returnValue(Promise.reject('Error'));
		(component as any).ngOnInit();
		tick();
		expect((component as any).error).toBeDefined();
		expect(storeMock.dispatch).toHaveBeenCalledTimes(2);
	}));

	it('should submit valid form, call updateThread, and navigate', fakeAsync(() => {
		const form = (component as any).form;
		form.get('title').setValue('Updated Title');
		form.get('body').setValue('Updated body content with sufficient length.');
		form.get('tags').setValue('tag3, tag4');

		(component as any).submit();
		expect((component as any).saving).toBeTrue();

		tick();

		expect(threadServiceMock.updateThread).toHaveBeenCalledWith('thread123', {
			title: 'Updated Title',
			body: 'Updated body content with sufficient length.',
			tags: ['tag3', 'tag4']
		});
		expect(routerMock.navigate).toHaveBeenCalledWith(['/threads', 'thread123']);
		expect((component as any).saving).toBeFalse();
	}));

	it('should mark all as touched and not submit if form invalid', fakeAsync(() => {
		const form = (component as any).form;
		spyOn(form, 'markAllAsTouched');
		form.get('title').setValue('');
		(component as any).submit();
		tick();
		expect(form.markAllAsTouched).toHaveBeenCalled();
		expect(threadServiceMock.updateThread).not.toHaveBeenCalled();
	}));

	it('should set error on submit failure', fakeAsync(() => {
		const form = (component as any).form;
		form.get('title').setValue('Valid Title');
		form.get('body').setValue('Valid body content with sufficient length');
		form.get('tags').setValue('');

		threadServiceMock.updateThread.and.returnValue(Promise.reject('Error'));

		(component as any).submit();
		tick();

		expect((component as any).error).toBeDefined();
		expect((component as any).saving).toBeFalse();
	}));

	it('should call location.back on onCancel', () => {
		(component as any).onCancel();
		expect(locationMock.back).toHaveBeenCalled();
	});
});
