import dataSource from '../dataSource';
import { EmailToken, tokenType } from '../entities/EmailToken';

export class EmailTokenDatastore {
	constructor() {}

	public async save(token: EmailToken): Promise<EmailToken | undefined> {
		let queryResult: EmailToken | undefined;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager.save(token);
		});
		if (queryResult) return queryResult;
	}

	public async deleteTokenByRole(roleId: string): Promise<void> {
		await dataSource.transaction(async (manager) => {
			await manager
				.createQueryBuilder()
				.delete()
				.from(EmailToken)
				.where('roleId = :roleId', { roleId })
				.andWhere('tokenType = :tokenType', {
					tokenType: tokenType.invite,
				})
				.execute();
		});
	}

	public async getTokenDetails(
		token: string,
	): Promise<EmailToken | undefined> {
		let queryResult;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(EmailToken)
				.createQueryBuilder('EmailToken')
				// .leftJoinAndSelect('EmailToken.role', 'role')
				.where('EmailToken.token = :token', { token })
				.getOne();
		});
		return queryResult;
	}
}
