import { IsNotEmpty } from 'class-validator';


export class LogAddElementDto {
  id?: number;

  @IsNotEmpty()
  trip_id: number;

  @IsNotEmpty()
  journey_id_api: string;

  @IsNotEmpty()
  stop_id_api: number;

  @IsNotEmpty()
  time: number;
}
