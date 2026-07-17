import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const acceptInvitationSchema = z.object({
	token: z.string().min(1, 'Token do convite é obrigatório'),
})

export interface AcceptInvitation extends z.infer<typeof acceptInvitationSchema> {}

export class AcceptInvitationDto extends createZodDto(acceptInvitationSchema) {}
