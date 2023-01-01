import { Track } from '@interfaces/tracks.interface';
import SpotifyService from './spotify.service';

export default class TrackService {
  spotifyService: SpotifyService = new SpotifyService();

  public async getPlaylistTracks(playlistId: string): Promise<Track[]> {
    const tracks: Track[] = await this.spotifyService.getPlaylistTracks(playlistId);
    return tracks;
  }
}
