import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LogEntity } from 'src/log/entities/log.entity';

@Entity('journies')
export class JourneyEntity {
  @PrimaryGeneratedColumn()
  journey_id: number;

  @Column()
  journey_name: string;

  @Column()
  service: string;

  @Column()
  description : string

  @Column()
  destination : string

  @OneToMany(() => LogEntity, log => log.service)
  logs: LogEntity[];
}