import { Track } from '@/interfaces/tracks.interface';
import PlaylistService from '@/services/playlists.service';
import { NextFunction, Request, Response } from 'express';

export default class PlaylistsController {
  public playlistService = new PlaylistService();

  public getPlaylistTracks = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const playlistId: string = req.params.id;

      const tracks = await this.playlistService.getPlaylistTracks(playlistId);

      res.status(200).json({ data: tracks });
    } catch (error) {
      next(error);
    }
  };
}
