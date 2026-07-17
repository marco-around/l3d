import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const createAuditLogSchema = z.object({
	tenantId: z.uuidv7().describe('ID of tenant'),
	userId: z.uuidv7().describe('ID of user making the action'),
	entity: z.string().describe('Entity affected'),
	entityId: z.uuidv7().describe('ID of entity affected'),
	ipAddress: z.string().describe('IP address of the user'),
	userAgent: z.string().describe('User agent of the client'),
	action: z.enum(['CREATE', 'UPDATE', 'DELETE']).describe('Action performed'),
	metadata: z.unknown().describe('Metadata about the resource').optional(),
})

export interface CreateAudit extends z.infer<typeof createAuditLogSchema> {}

export class CreateAuditLogDto extends createZodDto(createAuditLogSchema) {}
