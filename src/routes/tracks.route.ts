import { Router } from 'express';
import TracksController from '@controllers/tracks.controller';
import { Routes } from '@interfaces/routes.interface';

export default class TracksRoute implements Routes {
  public path = '/tracks';
  public router = Router();
  public tracksController = new TracksController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/playlist/:playlist_id`, this.tracksController.getPlaylistTracks);
  }
}
