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

import { Password } from '../auth/auth.password';

export enum SocialProvider {
  RIDEBIKE = 'ridebike',
  KAKAO = 'kakao',
}
@Index('username', ['username'], { unique: true })
@Entity({ schema: 'ridebike', name: 'users' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  @Column('varchar', { name: 'username', unique: true, length: 30 })
  username: string;

  @Column('varchar', { name: 'nickname', length: 30 })
  nickname: string;

  // @Column('varchar', { name: 'password', length: 300 })
  // password: string;

  @Column('varchar', { name: 'provider', length: 30 })
  provider: SocialProvider;

  // @Column('varchar', { name: 'refreshToken', default: null, length: 300 })
  // refreshToken: string;
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToOne(() => Password, { cascade: true })
  @JoinColumn()
  password: Password;
}
