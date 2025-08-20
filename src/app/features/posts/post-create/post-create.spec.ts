import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {PostCreate} from './post-create';
import {ReactiveFormsModule} from '@angular/forms';
import {PostService} from '../../../core/services/post.service';
import {AuthService} from '../../../core/services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';

describe('PostCreate', () => {
	let component: PostCreate;
	let fixture: ComponentFixture<PostCreate>;
	let postServiceMock: any;
	let authServiceMock: any;
	let routerMock: any;
	let activatedRouteMock: any;
	let locationMock: any;

	beforeEach(async () => {
		postServiceMock = {
			createPost: jasmine.createSpy('createPost'),
		};

		authServiceMock = {
			currentUid: jasmine.createSpy('currentUid').and.returnValue(Promise.resolve('user123')),
		};

		routerMock = {
			navigate: jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true)),
		};

		activatedRouteMock = {
			snapshot: {
				paramMap: {
					get: jasmine.createSpy('get').and.returnValue('thread123'),
				},
			},
		};

		locationMock = {
			back: jasmine.createSpy('back'),
		};

		await TestBed.configureTestingModule({
			imports: [PostCreate, ReactiveFormsModule],
			providers: [
				{provide: PostService, useValue: postServiceMock},
				{provide: AuthService, useValue: authServiceMock},
				{provide: Router, useValue: routerMock},
				{provide: ActivatedRoute, useValue: activatedRouteMock},
				{provide: Location, useValue: locationMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(PostCreate);
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
		expect(postServiceMock.createPost).not.toHaveBeenCalled();
	});

	it('should submit form, call createPost, reset form and navigate on success', fakeAsync(() => {
		(component as any).form.controls['body'].setValue('This is a long enough post body content.');

		postServiceMock.createPost.and.returnValue(Promise.resolve());

		(component as any).submit();

		expect((component as any).creating).toBeTrue();

		tick();

		expect(authServiceMock.currentUid).toHaveBeenCalled();
		expect(postServiceMock.createPost).toHaveBeenCalledWith({
			threadId: 'thread123',
			body: 'This is a long enough post body content.',
			authorId: 'user123',
		});
		expect((component as any).form.value.body).toBeNull(); // after reset
		expect(routerMock.navigate).toHaveBeenCalledWith(['/threads/thread123']);
		expect((component as any).creating).toBeFalse();
	}));

	it('should set error on submit failure', fakeAsync(() => {
		(component as any).form.controls['body'].setValue('This is a long enough post body content.');

		postServiceMock.createPost.and.returnValue(Promise.reject('Error'));

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
