import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import {
	ApiBearerAuth,
	ApiNotFoundResponse,
	ApiOperation,
	ApiParam,
	ApiTags,
} from '@nestjs/swagger'
import { TenantGuard } from '@src/modules/auth/guards/tenant.guard'
import { ZodResponse } from 'nestjs-zod'
import { CurrentTenant } from '../auth/decorators/current-tenant.decorator'
import { AuditService } from './audit.service'
import { AuditLogDto } from './schemas/audit-log.schema'
import { QueryAuditLogDto } from './schemas/query-audit-log.schema'

@ApiTags('Audit')
@ApiBearerAuth()
@UseGuards(TenantGuard)
@Controller('audit')
export class AuditController {
	constructor(private auditService: AuditService) {}

	@Get()
	@ApiOperation({ summary: 'List all audit logs' })
	@ZodResponse({ type: [AuditLogDto], status: 200 })
	findAll(@CurrentTenant('id') tenantId: string, @Query() query: QueryAuditLogDto) {
		return this.auditService.findAll(tenantId, query)
	}

	@Get(':id')
	@ApiOperation({ summary: 'Get a single audit log by ID' })
	@ApiParam({ name: 'id', description: 'Unique ID of the audit log' })
	@ZodResponse({ type: AuditLogDto, status: 200 })
	@ApiNotFoundResponse({ description: 'Audit log not found' })
	findOne(@CurrentTenant('id') tenantId: string, @Param('id') id: string) {
		return this.auditService.findOne(id, tenantId)
	}
}
