import {PluralizePipe} from './pluralize-pipe';

describe('PluralizePipe', () => {
	let pipe: PluralizePipe;

	beforeEach(() => {
		pipe = new PluralizePipe();
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return singular value if count is 1', () => {
		expect(pipe.transform('apple', 1)).toBe('apple');
	});

	it('should return provided pluralized version if count is not 1 and pluralizedVersion is provided', () => {
		expect(pipe.transform('apple', 2, 'appleses')).toBe('appleses');
	});

	it('should append "s" to value if count is not 1 and no pluralizedVersion is provided', () => {
		expect(pipe.transform('apple', 0)).toBe('apples');
		expect(pipe.transform('apple', 2)).toBe('apples');
	});

	it('should handle empty string value gracefully', () => {
		expect(pipe.transform('', 2)).toBe('s');
	});
});
