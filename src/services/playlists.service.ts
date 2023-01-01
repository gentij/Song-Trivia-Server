import { Track } from '@interfaces/tracks.interface';
import SpotifyService from './spotify.service';

export default class PlaylistService {
  spotifyService: SpotifyService = new SpotifyService();

  public async getPlaylistTracks(playlistId: string): Promise<Track[]> {
    const tracks = await this.spotifyService.getPlaylistTracks(playlistId);
    return tracks;
  }
}
