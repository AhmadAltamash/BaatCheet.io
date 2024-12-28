import { Router } from 'express'
import { verifyToken } from '../middleware/AuthMiddleware.js'

const channelRoutes = Router()

channelRoutes.post('/create-channel', verifyToken);
channelRoutes.post('');