import {
	Entity,
	Column,
	BaseEntity,
	PrimaryColumn,
	CreateDateColumn,
	UpdateDateColumn,
	OneToOne,
	// OneToMany,
	JoinColumn,
	ManyToOne,
	OneToMany,
} from 'typeorm';
import { UserRole } from './UserRole';
import { Branch } from './Branch';
import { InventoryItems } from './InventoryItems';

@Entity('User')
export class User extends BaseEntity {
	@PrimaryColumn({ type: 'varchar', length: 64 })
	public id!: string;

	@Column({ type: 'varchar', length: 255, unique: true })
	public email!: string;

	@Column({ type: 'varchar', length: 255 })
	public password!: string;

	@Column({ type: 'varchar', length: 64, nullable: true })
	public firstName?: string;

	@Column({ type: 'varchar', length: 64, nullable: true })
	public lastName?: string | null;

	@Column({ type: 'text', nullable: true })
	public avatar?: string | null;

	@Column({ type: 'varchar', nullable: true })
	public timezone?: string | null;

	@Column({ type: 'bigint', nullable: true })
	public phoneNumber?: number | null;

	@Column({ type: 'integer', default: 0 })
	public loginAttempt!: number;

	@Column({ type: 'datetime', nullable: true })
	public loginAttemptAt?: Date | null;

	@CreateDateColumn()
	public createdAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;

	@OneToOne(() => UserRole, (userRole) => userRole.user)
	public role!: UserRole;

	@ManyToOne(() => Branch, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	@JoinColumn({ name: 'branchId' })
	public branch!: Branch;

	@OneToMany(() => InventoryItems, (inventoryItem) => inventoryItem.user)
	public inventoryItem!: InventoryItems[];
}
