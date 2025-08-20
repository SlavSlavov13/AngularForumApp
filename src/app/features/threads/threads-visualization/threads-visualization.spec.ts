import {ComponentFixture, TestBed} from '@angular/core/testing';
import {ThreadsVisualization} from './threads-visualization';
import {Store} from '@ngrx/store';
import {of} from 'rxjs';
import {AppUserModel, ThreadModel} from '../../../shared/models';

describe('ThreadsVisualization', () => {
	let component: ThreadsVisualization;
	let fixture: ComponentFixture<ThreadsVisualization>;
	let storeMock: any;

	const mockThreads: (ThreadModel & { authorName?: string })[] = [
		{
			id: 'thread1',
			title: 'Thread One',
			body: 'Content of thread one.',
			tags: [],
			authorId: 'user1',
			createdAt: {} as any,
			replyCount: 0,
			authorName: 'User One',
		},
		{
			id: 'thread2',
			title: 'Thread Two',
			body: 'Content of thread two.',
			tags: [],
			authorId: 'user2',
			createdAt: {} as any,
			replyCount: 5,
			authorName: 'User Two',
		},
	];

	const mockProfileCardUser: AppUserModel = {
		uid: 'user1',
		displayName: 'User One',
		email: 'user1@example.com',
	};

	beforeEach(async () => {
		storeMock = {
			select: jasmine.createSpy('select').and.returnValue(of(true)),
		};

		await TestBed.configureTestingModule({
			imports: [ThreadsVisualization],
			providers: [{provide: Store, useValue: storeMock}],
		}).compileComponents();

		fixture = TestBed.createComponent(ThreadsVisualization);
		component = fixture.componentInstance;

		component.threads = mockThreads;
		component.error = null;
		component.threadsLimited = true;
		component.profileCardUser = mockProfileCardUser;
		component.inProfile = true;

		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should accept inputs and have proper initial state', () => {
		expect(component.threads.length).toBe(2);
		expect(component.error).toBeNull();
		expect(component.threadsLimited).toBeTrue();
		expect(component.profileCardUser).toEqual(mockProfileCardUser);
		expect(component.inProfile).toBeTrue();
	});

	it('should have loading$ observable from store select', () => {
		expect(storeMock.select).toHaveBeenCalledWith(jasmine.any(Function));
		expect((component as any).loading$).toBeDefined(); // protected loading$ accessed via any
	});
});
