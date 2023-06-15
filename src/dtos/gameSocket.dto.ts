import { IsString, IsUUID } from 'class-validator';

export class StartGameDto {
  @IsString()
  @IsUUID()
  public roomId: string;
}

export class GuessTrackDto {
  @IsString()
  @IsUUID()
  public roomId: string;

  @IsString()
  public guess: string;
}
