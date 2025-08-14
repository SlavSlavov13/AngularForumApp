import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
	selector: 'app-thread-create',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './thread-create.html',
	styleUrl: './thread-create.css'
})
export class ThreadCreate {
	form: FormGroup;

	constructor(private fb: FormBuilder) {
		this.form = this.fb.group({
			title: ['', [Validators.required, Validators.minLength(6)]],
			body: ['', [Validators.required, Validators.minLength(20)]],
			tags: [''],
		});
	}

	submit() {
		if (this.form.invalid) return;
		// TODO: call ThreadService.createThread(...)
		console.log('Create thread payload:', this.form.value);
	}
}
