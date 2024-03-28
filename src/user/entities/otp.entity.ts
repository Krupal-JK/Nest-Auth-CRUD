import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert } from 'typeorm';

@Entity()
export class Otp {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: String;

  @Column()
  otp: String;

  @Column()
  expire_time: Date;
}
