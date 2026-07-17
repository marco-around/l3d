import { Body, Controller, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import { CreateTenantDto } from './schemas/create-tenant.schema'
import { TenantsService } from './tenants.service'

@ApiTags('Tenants')
@ApiBearerAuth()
@Controller('tenants')
export class TenantsController {
	constructor(private readonly tenantsService: TenantsService) {}

	@Post()
	@ApiOperation({ summary: 'Create a new organization' })
	async create(@CurrentUser('userId') userId: string, @Body() dto: CreateTenantDto) {
		const tenant = await this.tenantsService.create(userId, dto)
		return { data: tenant }
	}
}
