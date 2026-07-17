import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'

export const createTenantSchema = z.object({
	name: z.string().min(3, 'Name must be at least 3 characters'),
	slug: z.string().min(3, 'Slug must be at least 3 characters').slugify(),
})

export interface CreateTenant extends z.infer<typeof createTenantSchema> {}

export class CreateTenantDto extends createZodDto(createTenantSchema) {}
