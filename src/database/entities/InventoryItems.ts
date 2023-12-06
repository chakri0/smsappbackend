import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	ManyToOne,
} from 'typeorm';
import { User } from './User';
import { Items } from './Items';
// import { Branch } from './Branch';

export enum statusType {
	inStock = 'InStock',
	consumed = 'consumed',
}

@Entity('InventoryItems')
export class InventoryItems {
	@PrimaryColumn({ type: 'varchar', length: 64 })
	public id!: string;

	@Column({ type: 'bigint' })
	public quantity!: number;

	@Column({ type: 'bigint' })
	public availableQuantity!: number;

	@Column({ type: 'enum', enum: statusType })
	public status!: string;

	@CreateDateColumn({ nullable: true })
	public expireDate!: Date;

	@CreateDateColumn()
	public addedAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;

	@ManyToOne(() => User, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	@JoinColumn({ name: 'addedBy' })
	public addedBy!: User;

	@ManyToOne(() => Items, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	@JoinColumn({ name: 'itemId' })
	public item!: Items;

	// @ManyToOne(() => Branch, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	// @JoinColumn({ name: 'branchId' })
	// public branch!: Branch;
}
