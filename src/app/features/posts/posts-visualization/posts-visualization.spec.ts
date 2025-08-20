import {ComponentFixture, TestBed} from '@angular/core/testing';
import {PostsVisualization} from './posts-visualization';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';

describe('PostsVisualization', () => {
	let component: PostsVisualization;
	let fixture: ComponentFixture<PostsVisualization>;
	let storeMock: any;

	beforeEach(async () => {
		storeMock = {
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		await TestBed.configureTestingModule({
			imports: [PostsVisualization],
			providers: [{provide: Store, useValue: storeMock}],
		}).compileComponents();

		fixture = TestBed.createComponent(PostsVisualization);
		component = fixture.componentInstance;

		component.posts = [
			{
				id: '1',
				threadId: 'thread1',
				body: 'Post 1 content',
				authorId: 'user1',
				createdAt: {} as any,
				authorName: 'User One',
			},
			{
				id: '2',
				threadId: 'thread2',
				body: 'Post 2 content',
				authorId: 'user2',
				createdAt: {} as any,
				authorName: 'User Two',
			},
		];

		component.error = null;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should remove post by id when onPostDeleted is called', () => {
		(component as any).onPostDeleted('1');
		expect(component.posts.length).toBe(1);
		expect(component.posts.find(post => post.id === '1')).toBeUndefined();
	});

	it('should set error message when onDeletionError is called', () => {
		(component as any).onDeletionError('Some error occurred');
		expect(component.error).toBe('Some error occurred');
	});
});
