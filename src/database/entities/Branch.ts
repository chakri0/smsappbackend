import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { User } from './User';
// import { Items } from './Items';
// import { InventoryItems } from './InventoryItems';

@Entity('Branch')
export class Branch {
	@PrimaryColumn({ type: 'varchar', length: 64 })
	public id!: string;

	@Column({ type: 'varchar', length: 64 })
	public storeName!: string;

	@Column({ type: 'varchar', length: 128 })
	public storeAddress!: string;

	@Column({ type: 'bigint', nullable: true })
	public phoneNumber?: number | null;

	@Column({ type: 'text', nullable: true })
	public image?: string | null;

	@CreateDateColumn()
	public createdAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;

	@OneToMany(() => User, (user) => user.branch)
	public user!: User[];

	// @OneToMany(() => Items, (item) => item.branch)
	// public item!: Items[];

	// @OneToMany(() => InventoryItems, (inventoryItem) => inventoryItem.branch)
	// public inventoryItem!: InventoryItems[];
}
