import { Router } from 'express'
import OrphanageController from './controllers/OrphanageController'
import multer from 'multer'
import uploadsConfig from './config/upload'

const routes = Router()
const upload = multer(uploadsConfig.multer)

routes.get('/orphanages', OrphanageController.index)

routes.get('/orphanages/:id', OrphanageController.show)

routes.post('/orphanages', upload.array('images'),OrphanageController.create)

export default routes