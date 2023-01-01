import { Track } from '@/interfaces/tracks.interface';
import TrackService from '@/services/tracks.service';
import { NextFunction, Request, Response } from 'express';

export default class TrackController {
  public trackService = new TrackService();

  public getPlaylistTracks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playlistId: string = req.params.playlist_id;

      const tracks: Array<Track> = await this.trackService.getPlaylistTracks(playlistId);

      res.status(200).json({ data: tracks });
    } catch (error) {
      next(error);
    }
  };
}
