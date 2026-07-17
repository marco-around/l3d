import { eq, invitations, tenantMembers } from '@l3d/database'
import { Inject, Injectable } from '@nestjs/common'
import { DRIZZLE_CONNECTION, type DrizzleDb } from '@src/shared/database/database.constants'

@Injectable()
export class InvitationsRepository {
	constructor(@Inject(DRIZZLE_CONNECTION) private readonly db: DrizzleDb) {}

	async findByToken(token: string) {
		const invitation = await this.db.query.invitations.findFirst({
			where: {
				token,
			},
		})

		return invitation ?? null
	}

	async acceptInvitation(
		invitationId: string,
		userId: string,
		tenantId: string,
		role: 'ADMIN' | 'ANALYST'
	) {
		return this.db.transaction(async (tx) => {
			await tx.insert(tenantMembers).values({
				userId,
				tenantId,
				role,
			})

			await tx
				.update(invitations)
				.set({
					status: 'ACCEPTED',
					acceptedAt: new Date(),
				})
				.where(eq(invitations.id, invitationId))
		})
	}
}
