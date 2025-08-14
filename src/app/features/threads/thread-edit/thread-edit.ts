import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";

@Component({
	selector: 'app-thread-edit',
	imports: [
		ReactiveFormsModule
	],
	templateUrl: './thread-edit.html',
	styleUrl: './thread-edit.css'
})
export class ThreadEdit {
	form: FormGroup;

	constructor(private fb: FormBuilder, private route: ActivatedRoute) {
		this.form = this.fb.group({
			title: ['', [Validators.required, Validators.minLength(6)]],
			body: ['', [Validators.required, Validators.minLength(20)]],
			tags: [''],
		});
		// TODO: load thread by route param id, patch form
	}

	submit() {
		if (this.form.invalid) return;
		// TODO: call ThreadService.updateThread(...)
		console.log('Update thread payload:', this.form.value);
	}

}
