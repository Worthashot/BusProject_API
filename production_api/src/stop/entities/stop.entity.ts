import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { LogEntity } from 'src/log/entities/log.entity';

@Entity('stops')
export class StopEntity {
  @PrimaryGeneratedColumn()
  stop_id: number;

  @Column()
  stop_name: string;

  @Column()
  stop_api_id: number;

  @Column()
  latitude : number

  @Column()
  longitude : number

  @Column()
  bearing : number

@OneToMany(() => LogEntity, log => log.stop)
  logs: LogEntity[];
}