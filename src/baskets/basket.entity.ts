import { Product } from "src/products/product.entity";
import { User } from "src/users/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Basket {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.basket)
    user: User;

    @ManyToOne(() => Product)
    product: Product;

    @Column()
    quantity: number;
}