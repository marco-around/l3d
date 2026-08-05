import { GoogleLogoIcon } from '@phosphor-icons/react'
import { Link } from 'react-router'
import { Button } from '@/shared/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'

export function SignInPage() {
	return (
		<form className="flex flex-col gap-6">
			<FieldGroup>
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-2xl font-bold">Login to your account</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Enter your email below to login to your account
					</p>
				</div>
				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input id="email" type="email" placeholder="m@example.com" required />
				</Field>
				<Field>
					<div className="flex items-center">
						<FieldLabel htmlFor="password">Password</FieldLabel>
						<Link to="#" className="ml-auto text-sm underline-offset-2 hover:underline">
							Forgot your password?
						</Link>
					</div>
					<Input id="password" type="password" required />
				</Field>
				<Field>
					<Button type="submit">Login</Button>
				</Field>
				<FieldSeparator>Or continue with</FieldSeparator>
				<Field>
					<Button variant="outline" type="button">
						<GoogleLogoIcon weight="bold" className="size-4" />
						Login with Google
					</Button>
					<FieldDescription className="text-center">
						Don't have an account?{' '}
						<Link to="/signup" className="underline underline-offset-4">
							Sign up
						</Link>
					</FieldDescription>
				</Field>
			</FieldGroup>
		</form>
	)
}
