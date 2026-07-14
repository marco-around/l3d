import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiNotFoundResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger'
import { ZodResponse } from 'nestjs-zod'
import { AuditService } from './audit.service'
import { AuditLogDto } from './schemas/audit-log.schema'
import { QueryAuditLogDto } from './schemas/query-audit-log.schema'

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
	constructor(private auditService: AuditService) {}

	@Get()
	@ApiOperation({ summary: 'List all audit logs' })
	@ZodResponse({ type: [AuditLogDto], status: 200 })
	findAll(@Query() query: QueryAuditLogDto) {
		const tenantId = 'TODO'
		return this.auditService.findAll(tenantId, query)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a single audit log by ID' })
	@ApiParam({ name: 'id', description: 'Unique ID of the audit log' })
	@ZodResponse({ type: AuditLogDto, status: 200 })
	@ApiNotFoundResponse({ description: 'Audit log not found' })
	findOne(@Param('id') id: string) {
		const tenantId = 'TODO'
		return this.auditService.findOne(id, tenantId)
	}
}
