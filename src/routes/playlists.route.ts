import { Router } from 'express';
import PlaylistsController from '@/controllers/playlists.controller';
import { Routes } from '@interfaces/routes.interface';

export default class TracksRoute implements Routes {
  public path = '/playlists';
  public router = Router();
  public playlistsController = new PlaylistsController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:playlist_id`, this.playlistsController.getPlaylistTracks);
  }
}
