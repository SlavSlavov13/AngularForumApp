import {Component, inject} from '@angular/core';
import {DIALOG_DATA, DialogRef} from "@angular/cdk/dialog";
import {ConfirmDeleteData} from "../../models";

@Component({
	selector: 'app-confirm-delete',
	imports: [],
	templateUrl: './confirm-delete.html',
	styleUrl: './confirm-delete.css'
})
export class ConfirmDelete {
	readonly dialogRef: DialogRef<boolean> = inject(DialogRef<boolean>);
	readonly data: ConfirmDeleteData = inject<ConfirmDeleteData>(DIALOG_DATA);

	onConfirm(): void {
		this.dialogRef.close(true);
	}

	onCancel(): void {
		this.dialogRef.close(false);
	}
}
