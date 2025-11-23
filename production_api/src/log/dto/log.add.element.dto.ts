import { IsNotEmpty } from 'class-validator';


export class LogAddElementDto {
  id?: number;

  @IsNotEmpty()
  trip_id: number;

  @IsNotEmpty()
  journey_id: string;

  @IsNotEmpty()
  stop_id: number;

  @IsNotEmpty()
  time: number;
}
