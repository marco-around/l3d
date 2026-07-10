import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const createAuditLogSchema = z.object({
	tenantId: z.uuid().describe('ID of tenant'),
	userId: z.uuid().describe('ID of user making the action'),
	action: z.enum(['CREATE', 'UPDATE', 'DELETE']).describe('Action performed'),
	metadata: z.unknown().describe('Metadata about the resource').optional(),
})

export class CreateAuditLogDto extends createZodDto(createAuditLogSchema) {}
