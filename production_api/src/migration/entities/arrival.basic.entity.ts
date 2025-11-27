import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('arrival_basic')
export class ArrivalBasicEntity {
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