import {createSelector} from '@ngrx/store';
import {AppState} from '../app.state';
import {LoadingState} from "./loading.reducer";

export const selectLoading: (state: AppState) => LoadingState = (state: AppState): LoadingState => state.loading;

export const selectLoadingVisible = createSelector(
	selectLoading,
	(state: LoadingState): boolean => state.count > 0
);
