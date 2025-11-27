
import { Entity, Column, PrimaryGeneratedColumn, Unique, ManyToOne, OneToMany} from 'typeorm';
import { StopEntity } from "src/stop/entities/stop.entity";
import { JourneyEntity } from "src/journey/entities/journey.entity";
import { ArrivalEntity } from './arrival.entity';
@Entity('log')
@Unique(['stop', 'journey', 'direction'])  // Prevents duplicates
export class LogEntity {
  @PrimaryGeneratedColumn()
  log_id: number;

  @ManyToOne(() => StopEntity, busStop => busStop.logs, { nullable: false })
  stop: StopEntity;

  @ManyToOne(() => JourneyEntity, journey => journey.logs, { nullable: false })
  service: JourneyEntity;

  @Column({ type: 'integer', nullable: true })
  stop_sequence: number;  // Order of stops in the route

  @Column({ type: 'text', nullable: true })
  direction: string;  // Northbound/Southbound/etc.

  @OneToMany(() => ArrivalEntity, arrival => arrival.log)
  arrivals: ArrivalEntity[];
}