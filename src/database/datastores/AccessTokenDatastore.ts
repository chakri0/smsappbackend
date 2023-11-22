import dataSource from '../dataSource';

import AccessToken from '../entities/AccessToken';

export class AccessTokenDatastore {
	constructor() {}

	public async storeAccessToken(
		tokenObj: AccessToken,
	): Promise<AccessToken | undefined> {
		let queryResult: AccessToken | undefined;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager.save(tokenObj);
		});

		if (queryResult) {
			return queryResult;
		}
	}
}
