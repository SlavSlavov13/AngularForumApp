import {Routes} from '@angular/router';
import {authGuard} from "./core/guards/auth-guard";
import {ownerGuard} from "./core/guards/owner-guard";
import {selfProfileRedirectGuard} from "./core/guards/self-profile-redirect-guard";
import {selfThreadRedirectGuard} from "./core/guards/self-thread-redirect-guard";
import {guestGuard} from "./core/guards/guest-guard";
import {existsGuard} from "./core/guards/exists-guard";

export const routes: Routes = [
	{path: '', pathMatch: 'full', redirectTo: 'threads'},

	{
		path: 'threads',
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./features/threads/threads-list/threads-list').then(m => m.ThreadsList),
			},
			{
				path: 'create',
				canActivate: [authGuard],
				loadComponent: () =>
					import('./features/threads/thread-create/thread-create').then(m => m.ThreadCreate),
			},
			{
				path: ':id',
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
				],

			},
		],
	},

	{
		path: 'my-profile',
		canActivate: [authGuard],
		children: [
			{
				path: '',
				loadComponent: () =>
					import('./features/account/profiles/my-profile/my-profile').then(m => m.MyProfile),
			},
			{
				path: 'threads',
				loadComponent: () =>
					import('./features/threads/my-threads/my-threads').then(m => m.MyThreads),
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
					import('./features/account/profiles/my-profile/my-profile').then(m => m.MyProfile),
				pathMatch: 'full'
			},
			{
				path: ':id',
				canActivate: [existsGuard],
				children: [
					{
						path: '',
						canActivate: [selfProfileRedirectGuard],
						loadComponent: () =>
							import('./features/account/profiles/profile-details/profile-details').then(m => m.ProfileDetails),
					},
					{
						path: 'threads',
						canActivate: [selfThreadRedirectGuard],
						loadComponent: () =>
							import('./features/threads/user-threads/user-threads').then(m => m.UserThreads),
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
			import('./features/threads/threads-list/threads-list').then(m => m.ThreadsList),
	},
];
