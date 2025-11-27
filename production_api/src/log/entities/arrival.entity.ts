import { Entity, Column, PrimaryGeneratedColumn, ManyToOne} from 'typeorm';
import { LogEntity } from './log.entity';

@Entity('arrival')
export class ArrivalEntity {
  @PrimaryGeneratedColumn()
  arrival_id: number;

  @Column()
  trip_id: number;

  @Column()
  date: number;

  @Column()
  time: number;

  @ManyToOne(() => LogEntity, log => log.arrivals, { nullable: false })
  log: LogEntity;
}