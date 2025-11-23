import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('log')
export class LogEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  trip_id: number;

  @Column()
  journey_id: string;

  @Column({ default: true })
  stop_id: number;

  @Column({ default: true })
  date: number;

  @Column({ default: true })
  time: number;
}