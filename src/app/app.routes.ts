import {Routes} from '@angular/router';
import {authGuard} from "./core/guards/auth-guard";
import {ownerGuard} from "./core/guards/owner-guard";
import {guestGuard} from "./core/guards/guest-guard";
import {existsGuard} from "./core/guards/exists-guard";
import {selfRedirectGuard} from "./core/guards/self-redirect-guard";

export const routes: Routes = [
	{path: '', pathMatch: 'full', redirectTo: 'threads'},

	{
		path: 'threads',
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./features/threads/all-threads-list/all-threads-list').then(m => m.AllThreadsList),
			},
			{
				path: 'create',
				canActivate: [authGuard],
				loadComponent: () =>
					import('./features/threads/thread-create/thread-create').then(m => m.ThreadCreate),
			},
			{
				path: ':threadId',
				canActivate: [existsGuard],
				children: [
					{
						path: '',
						loadComponent: () =>
							import('./features/threads/thread-details/thread-details').then(m => m.ThreadDetails),
					},
					{
						path: 'edit',
						canActivate: [authGuard, ownerGuard],
						loadComponent: () =>
							import('./features/threads/thread-edit/thread-edit').then(m => m.ThreadEdit),
					},
					{
						path: 'add-post',
						canActivate: [authGuard],
						loadComponent: () =>
							import('./features/posts/post-create/post-create').then(m => m.PostCreate),
					},
				],

			},
		],
	},

	{
		path: 'posts/:postId/edit',
		canActivate: [existsGuard, authGuard, ownerGuard],
		loadComponent: () =>
			import('./features/posts/post-edit/post-edit').then(m => m.PostEdit),
	},

	{
		path: 'my-profile',
		canActivate: [authGuard],
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./features/account/profiles/profile-details/profile-details').then(m => m.ProfileDetails),
			},
			{
				path: 'threads',
				loadComponent: () =>
					import('./features/threads/user-threads-list/user-threads-list').then(m => m.UserThreadsList),
			},
			{
				path: 'posts',
				loadComponent: () =>
					import('./features/posts/user-posts-list/user-posts-list').then(m => m.UserPostsList),
			},
			{
				path: 'edit',
				loadComponent: () =>
					import('./features/account/profiles/edit-profile/edit-profile').then(m => m.EditProfile),
			},
		],
	},

	{
		path: 'profile',
		children: [
			{
				path: '',
				canActivate: [authGuard],
				loadComponent: () =>
					import('./features/account/profiles/profile-details/profile-details').then(m => m.ProfileDetails),
				pathMatch: 'full'
			},
			{
				path: ':uid',
				canActivate: [existsGuard, selfRedirectGuard],
				children: [
					{
						path: '',
						loadComponent: () =>
							import('./features/account/profiles/profile-details/profile-details').then(m => m.ProfileDetails),
					},
					{
						path: 'threads',
						loadComponent: () =>
							import('./features/threads/user-threads-list/user-threads-list').then(m => m.UserThreadsList),
					},
					{
						path: 'posts',
						loadComponent: () =>
							import('./features/posts/user-posts-list/user-posts-list').then(m => m.UserPostsList),
					},
				],
			},
		],
	},

	{
		path: 'login',
		canActivate: [guestGuard],
		loadComponent: () =>
			import('./features/account/login/login').then(m => m.Login),
	},
	{
		path: 'register',
		canActivate: [guestGuard],
		loadComponent: () =>
			import('./features/account/register/register').then(m => m.Register),
	},

	{
		path: '**',
		loadComponent: () =>
			import('./shared/components/not-found/not-found').then(m => m.NotFound),
	},
];
