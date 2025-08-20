import {TestBed} from '@angular/core/testing';
import {Firestore} from '@angular/fire/firestore';
import {PostService} from './post.service';
import {Injector} from '@angular/core';

describe('PostService', () => {
	let service: PostService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				PostService,
				{provide: Firestore, useValue: {}},
				Injector
			]
		});

		service = TestBed.inject(PostService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
