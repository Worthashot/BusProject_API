import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('log')
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  trip_id: number;

  @Column()
  journey_id: string;

  @Column()
  stop_id: number;

  @Column()
  date: number;

  @Column()
  time: number;
}