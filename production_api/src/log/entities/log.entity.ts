import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity('oldlog')
export class OldLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  trip_id: number;

  @Column()
  journey_id: string;

  @Column({ default: true })
  stop_id: number;

  @Column({ default: true })
  time: number;
}

@Entity('log')
export class Log {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  trip_id: number;

  @Column()
  journey_id: string;

  @Column({ default: true })
  stop_id: number;

  @Column({ default: true })
  time: number;
}