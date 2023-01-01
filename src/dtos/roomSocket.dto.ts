import { IsString, Length } from 'class-validator';

export class CreateRoomDto {
  @IsString()
  @Length(6)
  public roomId: string;
}
