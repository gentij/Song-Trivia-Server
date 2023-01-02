import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import SpotifyController from '@/controllers/spotify.controller';

export default class SpotifyRoute implements Routes {
  public path = '/spotify';
  public router = Router();
  public spotifyController = new SpotifyController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/access-token`, this.spotifyController.getAccessToken);
  }
}
