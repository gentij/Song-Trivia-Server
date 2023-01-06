import { IsString, IsUUID } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsUUID()
  public roomId: string;
}

export class SelectRoomPlaylistDto {
  @IsString()
  public playlistId: string;

  @IsString()
  @IsUUID()
  public roomId: string;
}
