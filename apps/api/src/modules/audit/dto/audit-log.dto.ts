import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

const dateCodec = z.codec(z.iso.datetime(), z.date(), {
	decode: (s) => new Date(s),
	encode: (d) => d.toISOString(),
})
export const auditLogSchema = z.object({
	id: z.uuid().describe('Unique ID of the audit log'),
	tenantId: z.uuid().describe('ID of the tenant'),
	userId: z.uuid().describe('ID of the user who performed the action'),
	action: z.enum(['CREATE', 'UPDATE', 'DELETE']).describe('Action performed'),
	metadata: z.unknown().describe('Metadata about the action'),
	createdAt: dateCodec.describe('Creation timestamp'),
})

export class AuditLogDto extends createZodDto(auditLogSchema, { codec: true }) {}
