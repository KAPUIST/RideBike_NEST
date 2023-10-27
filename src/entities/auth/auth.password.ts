import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Users } from '../users/users';

@Entity({ schema: 'ridebike', name: 'password' })
export class Password {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'password', length: 300 })
  password: string;

  @Column('varchar', { name: 'refreshToken', length: 300, nullable: true })
  refreshToken: string;
  @OneToOne(() => Users)
  User: Users;
}
