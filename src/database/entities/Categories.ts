import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { Items } from './Items';

@Entity('Categories')
export class Categories {
	@PrimaryColumn({ type: 'varchar', length: 64 })
	public id!: string;

	@Column({ type: 'varchar', length: 64 })
	public name!: string;

	@CreateDateColumn()
	public createdAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;

	@OneToMany(() => Items, (items) => items.category)
	public item!: Items;
}
