import {
	Entity,
	PrimaryColumn,
	Column,
	CreateDateColumn,
	UpdateDateColumn,
	JoinColumn,
	ManyToOne,
} from 'typeorm';
import { Categories } from './Categories';

@Entity('Items')
export class Items {
	@PrimaryColumn({ type: 'varchar', length: 64 })
	public id!: string;

	@Column({ type: 'varchar', length: 64 })
	public name!: string;

	@Column({ type: 'varchar', length: 256, nullable: true })
	public description?: string | null;

	@Column({ type: 'text', nullable: true })
	public image?: string | null;

	@Column({ type: 'bigint', nullable: true })
	public dailyThreshold?: number | null;

	@Column({ type: 'bigint', nullable: true })
	public weeklyThreshold?: number | null;

	@Column({ type: 'bigint', nullable: true })
	public overallThreshold?: number | null;

	@CreateDateColumn()
	public createdAt!: Date;

	@UpdateDateColumn()
	public updatedAt!: Date;

	@ManyToOne(() => Categories, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
	@JoinColumn({ name: 'categoryId' })
	public category!: Categories;
}
