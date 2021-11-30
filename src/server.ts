import path from 'path'
import express from 'express'
import 'express-async-errors'
import routes from './routes'
import errorHandler from './errors/handler'
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json())

app.use(routes)

app.use('/uploads', express.static(path.resolve(__dirname, '..', 'tmp', 'uploads')))

app.use(errorHandler)

app.listen(3333, () => {
  console.log('Server started on port 3333')
})