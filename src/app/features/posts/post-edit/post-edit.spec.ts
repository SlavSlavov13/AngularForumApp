import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {PostEdit} from './post-edit';
import {ReactiveFormsModule} from '@angular/forms';
import {PostService} from '../../../core/services/post.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {Location} from '@angular/common';
import {of} from 'rxjs';

describe('PostEdit', () => {
	let component: PostEdit;
	let fixture: ComponentFixture<PostEdit>;
	let postServiceMock: any;
	let activatedRouteMock: any;
	let routerMock: any;
	let storeMock: any;
	let locationMock: any;

	const mockPost = {
		id: 'post123',
		threadId: 'thread123',
		body: 'Initial post body with enough length',
		authorId: 'user123',
		createdAt: undefined,
		updatedAt: undefined,
	};

	beforeEach(async () => {
		postServiceMock = {
			getPost: jasmine.createSpy('getPost').and.returnValue(Promise.resolve(mockPost)),
			updatePost: jasmine.createSpy('updatePost').and.returnValue(Promise.resolve()),
		};

		activatedRouteMock = {
			snapshot: {
				paramMap: {
					get: jasmine.createSpy('get').and.returnValue('post123'),
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
			imports: [PostEdit, ReactiveFormsModule],
			providers: [
				{provide: PostService, useValue: postServiceMock},
				{provide: ActivatedRoute, useValue: activatedRouteMock},
				{provide: Router, useValue: routerMock},
				{provide: Store, useValue: storeMock},
				{provide: Location, useValue: locationMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(PostEdit);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should load post and initialize form in ngOnInit', fakeAsync(() => {
		(component as any).ngOnInit();
		tick();

		expect(postServiceMock.getPost).toHaveBeenCalledWith('post123');
		expect((component as any).form.get('body').value).toBe(mockPost.body);
	}));

	it('should set error on ngOnInit failure', fakeAsync(() => {
		postServiceMock.getPost.and.returnValue(Promise.reject('Error'));

		(component as any).ngOnInit();

		tick();

		expect((component as any).error).toBeDefined();
	}));

	it('should submit valid form, call updatePost, navigate and reset saving flag', fakeAsync(() => {
		(component as any).form.get('body').setValue('Updated post body with enough length');

		(component as any).saving = false;

		(component as any).submit();

		expect((component as any).saving).toBeTrue();

		tick();

		expect(postServiceMock.updatePost).toHaveBeenCalledWith('post123', {body: 'Updated post body with enough length'});
		expect(routerMock.navigate).toHaveBeenCalledWith(['/threads', 'thread123']);
		expect((component as any).saving).toBeFalse();
	}));

	it('should mark all as touched and not submit if form invalid', fakeAsync(() => {
		spyOn((component as any).form, 'markAllAsTouched');
		(component as any).form.get('body').setValue('');
		(component as any).submit();

		tick();

		expect((component as any).form.markAllAsTouched).toHaveBeenCalled();
		expect(postServiceMock.updatePost).not.toHaveBeenCalled();
	}));

	it('should set error on submit failure', fakeAsync(() => {
		(component as any).form.get('body').setValue('Valid post body content');

		postServiceMock.updatePost.and.returnValue(Promise.reject('Error'));

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
