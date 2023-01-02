import SpotifyService from '@/services/spotify.service';
import { NextFunction, Request, Response } from 'express';

export default class SpotifyController {
  public spotifyService = new SpotifyService();

  public getAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accessToken = await this.spotifyService.getAccessToken();

      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  };
}
