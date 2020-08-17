import express from 'express';
import authenticationRoutes from './authentication';

const routes = express.Router();

routes.use('/auth', authenticationRoutes);

export default routes;
