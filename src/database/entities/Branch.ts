import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	OneToMany,
} from 'typeorm';
import { User } from './User';

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
}
