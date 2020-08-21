import express from 'express';
import authenticationRoutes from './authentication';
import adminRoutes from './admin';

const routes = express.Router();

routes.use('/auth', authenticationRoutes);
routes.use('/admin', adminRoutes);

export default routes;
