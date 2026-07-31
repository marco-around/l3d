import type { RouteObject } from 'react-router'
import { AuthLayout } from '@/shared/layouts/auth-layout'
import { SignInPage } from '../pages/sign-in-page'
import { SignUpPage } from '../pages/sign-up-page'

export const authRoutes: RouteObject[] = [
	{
		path: '/',
		element: <AuthLayout />,
		children: [
			{
				element: <SignInPage />,
				index: true,
			},
			{
				path: 'signup',
				element: <SignUpPage />,
			},
		],
	},
]
