import {TestBed} from '@angular/core/testing';
import {ThreadService} from './thread.service';
import {PostService} from "./post.service";
import {Firestore} from "@angular/fire/firestore";
import {Injector} from "@angular/core";

describe('ThreadService', () => {
	let service: ThreadService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				PostService,
				{provide: Firestore, useValue: {}},
				Injector
			]
		});
		service = TestBed.inject(ThreadService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});
});
