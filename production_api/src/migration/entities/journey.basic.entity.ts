import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('journey_basic')
export class JourneyBasicEntity {
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
}