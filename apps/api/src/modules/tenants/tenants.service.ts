import { ConflictException, Injectable } from '@nestjs/common'
import type { CreateTenant } from './schemas/create-tenant.schema'
import { TenantsRepository } from './tenants.repository'

@Injectable()
export class TenantsService {
	constructor(private readonly tenantsRepository: TenantsRepository) {}

	async create(userId: string, payload: CreateTenant) {
		const existing = await this.tenantsRepository.findBySlug(payload.slug)
		if (existing) {
			throw new ConflictException('Slug already in use')
		}

		return this.tenantsRepository.createWithAdmin(
			{ name: payload.name, slug: payload.slug },
			userId
		)
	}
}
