import { GoogleLogoIcon } from '@phosphor-icons/react'
import { Button } from '@/shared/components/ui/button'
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from '@/shared/components/ui/field'
import { Input } from '@/shared/components/ui/input'

export function SignUpPage() {
	return (
		<form className="flex flex-col gap-6">
			<FieldGroup>
				<div className="flex flex-col items-center gap-1 text-center">
					<h1 className="text-2xl font-bold">Create an account</h1>
					<p className="text-sm text-balance text-muted-foreground">
						Enter your email below to create an account
					</p>
				</div>

				<Button variant="outline" type="button">
					<GoogleLogoIcon weight="bold" className="size-4" />
					Continue with Google
				</Button>

				<FieldSeparator>Or continue with Email</FieldSeparator>

				<Field>
					<FieldLabel htmlFor="email">Email</FieldLabel>
					<Input id="email" type="email" placeholder="m@example.com" required />
				</Field>

				<Button type="submit">Create Account</Button>

				<FieldDescription className="text-center">
					Have account?{' '}
					<a href="/" className="underline underline-offset-4">
						Sign in
					</a>
				</FieldDescription>
			</FieldGroup>
		</form>
	)
}
