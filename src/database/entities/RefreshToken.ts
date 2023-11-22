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

@Entity('RefreshToken')
export class RefreshToken extends BaseEntity {
	@PrimaryColumn({ type: 'varchar', length: 64 })
	public id!: string;

	@ManyToOne(() => UserRole, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
	@JoinColumn({ name: 'roleId' })
	public role!: UserRole;

	@Column({ type: 'text' })
	public token!: string;

	@Column({ type: 'text' })
	public slackToken!: string;

	@CreateDateColumn()
	public createdAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;
}
