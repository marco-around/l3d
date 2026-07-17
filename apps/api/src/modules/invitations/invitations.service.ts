import { BadRequestException, Injectable } from '@nestjs/common'
import { InvitationsRepository } from './invitations.repository'

@Injectable()
export class InvitationsService {
	constructor(private readonly invitationsRepository: InvitationsRepository) {}

	async accept(userId: string, token: string) {
		const invitation = await this.invitationsRepository.findByToken(token)

		if (!invitation) {
			throw new BadRequestException('Invitation not found')
		}

		if (invitation.status !== 'PENDING') {
			throw new BadRequestException('Invitation already used or revoked')
		}

		if (invitation.expiresAt < new Date()) {
			throw new BadRequestException('Invitation expired')
		}

		await this.invitationsRepository.acceptInvitation(
			invitation.id,
			userId,
			invitation.tenantId,
			invitation.role
		)

		return {
			tenantId: invitation.tenantId,
			role: invitation.role,
		}
	}
}
