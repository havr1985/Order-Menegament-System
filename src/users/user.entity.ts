import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;
    
  @ApiProperty({ example: 'John Doe' })
  @Column()
  name: string;

  @ApiProperty({ example: 'john@mail.com' })
  @Column({ unique: true })
  email: string;

  @ApiProperty({ example: 'password123' })
  @Column()
  password: string;

  @ApiProperty({ example: 'user' })
  @Column({ default: 'user' })
  role: string;
}
