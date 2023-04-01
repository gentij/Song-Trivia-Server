import { IsString, IsUUID } from 'class-validator';

export class JoinRoomDto {
  @IsString()
  @IsUUID()
  public roomId: string;
}

export class LeaveRoomDto {
  @IsString()
  @IsUUID()
  public roomId: string;
}

export class SelectRoomPlaylistDto {
  @IsString()
  public playlist: string;

  @IsString()
  @IsUUID()
  public roomId: string;
}
