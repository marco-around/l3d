import { SignatureIcon } from '@phosphor-icons/react'
import { Outlet } from 'react-router'
import AuthBackground from '../assets/auth-background.webp'
import { ThemeToggle } from '../components/theme-toggle'

export function AuthLayout() {
	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex relative justify-center gap-2 md:justify-start">
					<a href="/" className="flex items-center gap-2 font-medium">
						<div className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<SignatureIcon className="size-4" />
						</div>
						L3D.
					</a>

					<div className="absolute right-0">
						<ThemeToggle />
					</div>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs">
						<Outlet />
					</div>
				</div>
			</div>
			<div className="relative hidden bg-muted lg:block">
				<img
					src={AuthBackground}
					alt="noise gradient background"
					className="absolute inset-0 size-full object-cover"
				/>
			</div>
		</div>
	)
}
