import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const signInSchema = z.object({
	email: z.email('Invalid email'),
	password: z.string().min(1, 'Password is required'),
})

export interface SignIn extends z.infer<typeof signInSchema> {}

export class SignInDto extends createZodDto(signInSchema) {}
