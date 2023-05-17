import { IsString, IsUUID } from 'class-validator';

export class StartGameDto {
  @IsString()
  @IsUUID()
  public roomId: string;
}
