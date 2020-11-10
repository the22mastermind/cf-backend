import express from 'express';
import authenticationRoutes from './authentication';
import adminRoutes from './admin';
import categoryRoutes from './category';
import userRoutes from './user';
import riderRoutes from './rider';

const routes = express.Router();

routes.use('/auth', authenticationRoutes);
routes.use('/admin', adminRoutes);
routes.use('/categories', categoryRoutes);
routes.use('/', userRoutes);
routes.use('/rider', riderRoutes);

export default routes;
