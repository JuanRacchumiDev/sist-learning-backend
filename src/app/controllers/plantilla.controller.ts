import { Request, Response, NextFunction } from 'express'
import PlantillaService from '../services/plantilla.service'
import { IPlantilla } from '../interfaces/Plantilla/IPlantilla'
import fs from 'fs';

class PlantillaController {
    async getPlantillas(req: Request, res: Response) {
        const response = await PlantillaService.getPlantillas()

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getPlantillasPaginated(req: Request, res: Response) {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const estadoParam = req.query.estado
        const search = req.query.busqueda as string | undefined
        let estado: boolean | undefined

        if (typeof estadoParam === 'string') {
            estado = estadoParam.toLowerCase() === 'true'
        }

        const response = await PlantillaService.getPlantillasPaginado(page, limit, estado, search)

        const { result } = response

        if (result) {
            res.status(200).json(response)
        } else {
            res.status(500).json(response)
        }
    }

    async getPlantillasPorEstado(req: Request, res: Response) {
        const { estado } = req.params

        const estadoParam: boolean = estado === 'true'

        const response = await PlantillaService.getPlantillasPorEstado(estadoParam)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response)
            }
        }
    }

    async getPlantillasPorEvento(req: Request, res: Response) {
        const { idEvento } = req.params

        const response = await PlantillaService.getPlantillasPorEvento(+idEvento)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(404).json(response)
            }
        }
    }

    async getPlantillaPorId(req: Request, res: Response) {
        const { id } = req.params

        const response = await PlantillaService.getPlantillaPorId(+id)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response);
            }
        }
    }

    async getPlantillasPorNombre(req: Request, res: Response) {
        const { nombre } = req.params

        const response = await PlantillaService.getPlantillasPorNombre(nombre)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updatePlantilla(req: Request, res: Response) {
        const { id } = req.params;

        const response = await PlantillaService.updatePlantilla(+id, req.body);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }

    async updateEstado(req: Request, res: Response) {
        const { id } = req.params

        const { estado } = req.body

        if (typeof estado !== 'boolean') {
            res.status(400).json({
                result: false,
                message: 'Tipo de dato incorrecto'
            })
        }

        const response = await PlantillaService.updateEstado(+id, estado)

        const { result, error } = response

        if (result) {
            res.status(200).json(response)
        } else {
            if (error) {
                res.status(500).json(response)
            } else {
                res.status(200).json(response)
            }
        }
    }

    async deletePlantilla(req: Request, res: Response) {
        const { id } = req.params;

        const response = await PlantillaService.deletePlantilla(+id);

        const { result, error } = response

        if (result) {
            res.status(200).json(response);
        } else {
            if (error) {
                res.status(500).json(response);
            } else {
                res.status(200).json(response);
            }
        }
    }
}

export default new PlantillaController()