import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
	name: 'pluralize'
})
export class PluralizePipe implements PipeTransform {

	transform(value: string, count: number, pluralizedVersion?: string): string {
		if (count === 1) {
			return value;
		} else if (pluralizedVersion) {
			return pluralizedVersion
		}
		return value + 's';
	}

}
