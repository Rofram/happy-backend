import { PrismaClient } from '@prisma/client'
import { Request, Response } from 'express'
import * as yup from 'yup'

const prisma = new PrismaClient();

export default {
  async index(req: Request, res: Response) {
    try {
      const orphanages = await prisma.orphanages.findMany({
        include: {
          Images: {
            select: {
              id: true,
              url: true
            }
          }
        }
      })

      const orphanagesWithImages = orphanages.map(orphanage => {
        return {
          id: orphanage.id,
          name: orphanage.name,
          latitude: orphanage.latitude,
          longitude: orphanage.longitude,
          about: orphanage.about,
          instructions: orphanage.instructions,
          opening_hours: orphanage.opening_hours,
          open_on_weekends: orphanage.open_on_weekends,
          images: orphanage.Images.map(image => ({
            id: image.id,
            url: `${process.env.UPLOADS_URL}/${image.url}`
          }))
        }
      })
  
      return res.json(orphanagesWithImages);
    }
    catch (err) {
      if (err instanceof Error) {
        return res.status(500).json({
          message: "Database not found"
        })
      }
    }
  },

  async show(req: Request, res: Response) {
    const { id } = req.params

    try {
      const orphanage = await prisma.orphanages.findFirst({
        where: {
          id
        },
        include: {
          Images: true,
        }
      })

      if (!orphanage) {
        throw new Error('Orphanage not found')
      }

      const orphanagesWithImages = {
        id: orphanage.id,
        name: orphanage.name,
        latitude: orphanage.latitude,
        longitude: orphanage.longitude,
        about: orphanage.about,
        instructions: orphanage.instructions,
        opening_hours: orphanage.opening_hours,
        open_on_weekends: orphanage.open_on_weekends,
        images: orphanage.Images.map(image => ({
          id: image.id,
          url: `${process.env.UPLOADS_URL}/${image.url}`
        }))
      }
  
      return res.json(orphanagesWithImages);
    }
    catch (err) {
      if (err instanceof Error) {
        return res.status(404).json({ error: err.message })
      }

      return res.status(500).json({ error: 'Internal server error' })
    }
  },

  async create(req: Request, res: Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends
    } = req.body

    const data = {
      name,
      latitude: Number(latitude),
      longitude: Number(longitude),
      about,
      instructions,
      opening_hours,
      open_on_weekends: open_on_weekends === 'true',
    }

    const schema = yup.object().shape({
      name: yup.string().required(),
      latitude: yup.number().required(),
      longitude: yup.number().required(),
      about: yup.string().required().max(300),
      instructions: yup.string().required(),
      whatsapp: yup.string().matches(/^\([0-9]{2}\) [0-9]{5}-[0-9]{4}$/),
      opening_hours: yup.string().required(),
      open_on_weekends: yup.boolean().required()
    })

    await schema.validate(data, { abortEarly: false })

    const reqImages = req.files as Express.Multer.File[]
  
    const orphanage = await prisma.orphanages.create({
      data: {
        ...data,
        ...(reqImages.length > 0 && {
          Images: {
            createMany: {
              data: reqImages.map(image => ({
                url: image.filename
              }))
            }
          }
        })
      },
    })

    return res.status(201).json({
      ...orphanage,
      Images: reqImages.map(image => ({
        url: image.filename
      }))
    })
  }
}