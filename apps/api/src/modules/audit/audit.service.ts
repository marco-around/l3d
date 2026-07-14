import { Injectable, NotFoundException } from '@nestjs/common'
import { AuditRepository } from './audit.repository'
import { CreateAuditLogDto } from './schemas/create-audit-log.schema'
import { QueryAuditLogDto } from './schemas/query-audit-log.schema'

@Injectable()
export class AuditService {
	constructor(private auditRepository: AuditRepository) {}

	async log(payload: CreateAuditLogDto) {
		const log = await this.auditRepository.log(payload)

		return log
	}

	async findAll(tenantId: string, query: QueryAuditLogDto) {
		return this.auditRepository.findAll(tenantId, query)
	}

	async findOne(id: string, tenantId: string) {
		const log = await this.auditRepository.findOne(id, tenantId)

		if (!log) {
			throw new NotFoundException(`Audit log with id ${id} not found`)
		}

		return log
	}
}
