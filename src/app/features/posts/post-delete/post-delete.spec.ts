import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {PostDelete} from './post-delete';
import {PostService} from '../../../core/services/post.service';
import {Dialog} from '@angular/cdk/dialog';
import {of} from 'rxjs';

describe('PostDelete', () => {
	let component: PostDelete;
	let fixture: ComponentFixture<PostDelete>;
	let postServiceMock: any;
	let dialogMock: any;

	beforeEach(async () => {
		postServiceMock = {
			getPost: jasmine.createSpy('getPost'),
			deletePost: jasmine.createSpy('deletePost'),
		};

		dialogMock = {
			open: jasmine.createSpy('open'),
		};

		await TestBed.configureTestingModule({
			imports: [PostDelete],
			providers: [
				{provide: PostService, useValue: postServiceMock},
				{provide: Dialog, useValue: dialogMock},
			],
		}).compileComponents();

		fixture = TestBed.createComponent(PostDelete);
		component = fixture.componentInstance;
		fixture.detectChanges();

		component.postId = 'post123'; // Required @Input
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should delete post after confirmation', fakeAsync(() => {
		const mockPost = {body: 'Post body content'};
		postServiceMock.getPost.and.returnValue(Promise.resolve(mockPost));
		const dialogRefMock = {
			closed: of(true),
		};
		dialogMock.open.and.returnValue(dialogRefMock);
		postServiceMock.deletePost.and.returnValue(Promise.resolve());
		spyOn(component.postDeleted, 'emit');
		spyOn(component.deletionError, 'emit');

		(component as any).delete();
		tick();

		expect(postServiceMock.getPost).toHaveBeenCalledWith('post123');
		expect(dialogMock.open).toHaveBeenCalled();
		expect(postServiceMock.deletePost).toHaveBeenCalledWith('post123');
		expect(component.postDeleted.emit).toHaveBeenCalledWith('post123');
		expect(component.deletionError.emit).not.toHaveBeenCalled();
	}));

	it('should not delete post if confirmation is false', fakeAsync(() => {
		postServiceMock.getPost.and.returnValue(Promise.resolve({body: 'Post body content'}));
		const dialogRefMock = {
			closed: of(false),
		};
		dialogMock.open.and.returnValue(dialogRefMock);
		spyOn(component.postDeleted, 'emit');
		spyOn(component.deletionError, 'emit');

		(component as any).delete();
		tick();

		expect(postServiceMock.deletePost).not.toHaveBeenCalled();
		expect(component.postDeleted.emit).not.toHaveBeenCalled();
		expect(component.deletionError.emit).not.toHaveBeenCalled();
	}));

	it('should emit error on delete failure', fakeAsync(() => {
		postServiceMock.getPost.and.returnValue(Promise.resolve({body: 'Post body content'}));
		const dialogRefMock = {
			closed: of(true),
		};
		dialogMock.open.and.returnValue(dialogRefMock);
		postServiceMock.deletePost.and.returnValue(Promise.reject('Delete error'));
		spyOn(component.postDeleted, 'emit');
		spyOn(component.deletionError, 'emit');

		(component as any).delete();
		tick();

		expect(component.postDeleted.emit).not.toHaveBeenCalled();
		expect(component.deletionError.emit).toHaveBeenCalled();
	}));
});
