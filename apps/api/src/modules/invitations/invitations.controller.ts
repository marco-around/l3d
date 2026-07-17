import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { InvitationsService } from './invitations.service'
import { AcceptInvitationDto } from './schemas/accept-invitation.schema'

@ApiTags('Invitations')
@ApiBearerAuth()
@Controller('invitations')
export class InvitationsController {
	constructor(private readonly invitationsService: InvitationsService) {}

	@HttpCode(HttpStatus.OK)
	@Post('accept')
	@ApiOperation({ summary: 'Accept an invitation to join an organization' })
	async accept(@Body() payload: AcceptInvitationDto) {
		const userId = 'TODO'
		const result = await this.invitationsService.accept(userId, payload.token)
		return { data: result }
	}
}
