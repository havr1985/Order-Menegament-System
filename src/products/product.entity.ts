import { Category } from 'src/categories/category.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Category, (category) => category.products, {onDelete: 'CASCADE'})
  category: Category;
}
