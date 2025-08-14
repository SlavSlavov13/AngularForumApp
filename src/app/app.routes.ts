import {Routes} from '@angular/router';

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
				loadComponent: () =>
					import('./features/threads/thread-create/thread-create').then(m => m.ThreadCreate),
				canActivate: [() => import('./core/guards/auth-guard').then(m => m.authGuard)],
			},
			{
				path: ':id',
				children: [
					{
						path: '',
						loadComponent: () =>
							import('./features/threads/thread-details/thread-details').then(m => m.ThreadDetails),
					},
					{
						path: 'edit',
						loadComponent: () =>
							import('./features/threads/thread-edit/thread-edit').then(m => m.ThreadEdit),
						canActivate: [
							() => import('./core/guards/auth-guard').then(m => m.authGuard),
							() => import('./core/guards/owner-guard').then(m => m.ownerGuard),
						],
					},
				],

			},
		],
	},

	{
		path: 'my-profile',
		canActivate: [() => import('./core/guards/auth-guard').then(m => m.authGuard)],
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
				path: ':id',
				children: [
					{
						path: '',
						canActivate: [() => import('./core/guards/self-profile-redirect-guard').then(m => m.selfProfileRedirectGuard)],
						loadComponent: () =>
							import('./features/account/profiles/profile-details/profile-details').then(m => m.ProfileDetails),
					},
					{
						path: 'threads',
						canActivate: [() => import('./core/guards/self-thread-redirect-guard').then(m => m.selfThreadRedirectGuard)],
						loadComponent: () =>
							import('./features/threads/user-threads/user-threads').then(m => m.UserThreads),
					},
				],
			},
		],
	},

	{
		path: 'login',
		loadComponent: () =>
			import('./features/account/login/login').then(m => m.Login),
	},
	{
		path: 'register',
		loadComponent: () =>
			import('./features/account/register/register').then(m => m.Register),
	},

	// {
	// 	path: '**',
	// 	loadComponent: () =>
	// 		import('./features/not-found/not-found').then(m => m.NotFound),
	// },
];
