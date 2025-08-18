import {createReducer, on} from '@ngrx/store';
import {hideLoading, showLoading} from './loading.actions';

export interface LoadingState {
	count: number;
}

export const initialState: LoadingState = {count: 0};

export const loadingReducer = createReducer(
	initialState,
	on(showLoading, state => {
		console.log(state.count + 1)
		return {count: state.count + 1};
	}),
	on(hideLoading, state => {
		console.log(state.count - 1)
		return {count: Math.max(state.count - 1, 0)};
	})
);
