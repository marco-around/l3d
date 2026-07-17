import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const queryAuditLogSchema = z
	.object({
		userId: z.string().describe('ID of user making the action'),
		action: z.enum(['CREATE', 'UPDATE', 'DELETE']).describe('Action performed'),
		limit: z.coerce.number().min(1).describe('Limit the number of results'),
		offset: z.coerce.number().min(0).describe('Offset for pagination'),
	})
	.partial()

export interface QueryAuditLog extends z.infer<typeof queryAuditLogSchema> {}

export class QueryAuditLogDto extends createZodDto(queryAuditLogSchema) {}
