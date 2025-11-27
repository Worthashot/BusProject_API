import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { LogEntity } from 'src/log/entities/log.entity';

@Entity('stop_basic')
export class StopBasicEntity {
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

}