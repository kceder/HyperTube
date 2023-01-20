import cron from 'cron';
import { deleteMovies } from './download.js';

const jobDeleteMovies = new cron.CronJob('0 0 * * *', function() {
    deleteMovies()
  });

export default jobDeleteMovies;