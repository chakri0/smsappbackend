import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	ManyToOne,
	JoinColumn,
	BaseEntity,
} from 'typeorm';
import { UserRole } from './UserRole';

export enum tokenType {
	forgotPassword = 'forgotpassword',
	registration = 'registration',
	invite = 'invite',
}

@Entity('EmailToken')
export class EmailToken extends BaseEntity {
	@PrimaryColumn({ type: 'varchar', length: 64 })
	public id!: string;

	@ManyToOne(() => UserRole, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
	@JoinColumn({ name: 'roleId' })
	public role!: UserRole;

	@Column({ type: 'text' })
	public token!: string;

	@Column({ type: 'enum', enum: tokenType })
	public tokenType!: string;

	@CreateDateColumn()
	public createdAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;
}
