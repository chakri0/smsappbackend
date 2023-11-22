import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	OneToOne,
} from 'typeorm';
import { User } from './User';

export enum roleName {
	superAdmin = 'superAdmin',
	admin = 'admin',
	manager = 'manager',
}

@Entity('UserRole')
export class UserRole {
	@PrimaryColumn({ type: 'varchar', length: 64 })
	public id!: string;

	@OneToOne(() => User, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
	@JoinColumn({ name: 'userId' })
	public user!: User;

	@Column({ type: 'enum', enum: roleName })
	public roleName!: string;

	@Column({
		type: 'tinyint',
		width: 1,
	})
	public isVerified!: boolean;

	@Column({
		type: 'tinyint',
		width: 1,
	})
	public isActivated!: boolean;

	@CreateDateColumn()
	public createdAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;
}
