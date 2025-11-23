import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('log_old')
export class LogEntityOld {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trip_id: number;

  @Column()
  journey_id: string;

  @Column()
  stop_id: number;

  @Column()
  time: number;
}