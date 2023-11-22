import { User } from '../entities/User';
import dataSource from '../dataSource';
import { UserRole } from '../entities/UserRole';

export class UserDatastore {
	constructor() {}

	public async getById(userId: string): Promise<User | undefined> {
		let queryResult: User | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(User)
				.createQueryBuilder('User')
				.leftJoinAndSelect('User.role', 'role')
				.where('User.id = :id', { id: userId })
				.getOne();
		});

		if (queryResult) {
			return queryResult;
		}
	}

	public async getUserByEmail(email: string): Promise<User | undefined> {
		let queryResult: User | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(User)
				.createQueryBuilder('User')
				.leftJoinAndSelect('User.role', 'role')
				.leftJoinAndSelect('User.branch', 'branch')
				.where('User.email = :email', { email })
				.getOne();
		});

		if (queryResult) {
			return queryResult;
		}
	}

	public async getUserRoleById(
		userId: string,
	): Promise<UserRole | undefined> {
		let queryResult: UserRole | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(UserRole)
				.createQueryBuilder('UserRole')
				.leftJoinAndSelect('UserRole.user', 'user')
				.where('user.id = :userId', { userId })
				.getOne();
		});

		if (queryResult) {
			return queryResult;
		}
	}

	public async save(user: User): Promise<User | undefined> {
		let queryResult: User | undefined;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager.save(user);
		});
		if (queryResult) {
			return queryResult;
		}
	}

	public async saveUserRole(
		userRole: UserRole,
	): Promise<UserRole | undefined> {
		let queryResult: UserRole | undefined;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager.save(userRole);
		});
		if (queryResult) {
			return queryResult;
		}
	}

	public async getUsersListByBranch(
		branchId: string,
	): Promise<User[] | undefined> {
		let queryResult: User[] | undefined | null;
		await dataSource.transaction(async (manager) => {
			queryResult = await manager
				.getRepository(User)
				.createQueryBuilder('User')
				.leftJoinAndSelect('User.role', 'role')
				.leftJoinAndSelect('User.branch', 'branch')
				.where('User.branch = :branchId', { branchId })
				.andWhere('User.password IS NOT NULL')
				.andWhere('User.password != :emptyString', { emptyString: '' })
				.getMany();
		});

		if (queryResult) {
			return queryResult;
		}
	}
}
