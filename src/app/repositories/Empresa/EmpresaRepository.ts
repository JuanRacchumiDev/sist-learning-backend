import { Empresa } from '../../models/empresa.models';
import { IEmpresa, EmpresaResponse, IEmpresaPaginate, EmpresaResponsePaginate } from '../../interfaces/Empresa/IEmpresa'
import { EMPRESA_ATTRIBUTES } from '../../../constants/EmpresaConstant';
import HPagination from '../../../helpers/HPagination';
import { Op } from 'sequelize';

class EmpresaRepository {
    async getAll(): Promise<EmpresaResponse> {
        try {
            const empresas = await Empresa.findAll({
                attributes: EMPRESA_ATTRIBUTES,
                order: [
                    ['nombre', 'ASC']
                ]
            })
            return { result: true, data: empresas, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async getAllWithPaginate(page: number, limit: number, estado?: boolean, search?: string): Promise<EmpresaResponsePaginate> {
        try {
            // Obtenemos los parámetros de consulta
            const offset = HPagination.getOffset(page, limit)

            const whereConditions: any = {}
            if (typeof estado === 'boolean') {
                whereConditions.estado = estado
            }

            if (search) {
                whereConditions[Op.or] = [
                    { nombre: { [Op.like]: `%${search}%` } },
                    { email: { [Op.like]: `%${search}%` } },
                ]
            }

            const { count, rows } = await Empresa.findAndCountAll({
                attributes: EMPRESA_ATTRIBUTES,
                where: whereConditions,
                order: [
                    ['nombre', 'ASC']
                ],
                limit,
                offset
            })

            const totalPages = Math.ceil(count / limit)
            const nextPage = HPagination.getNextPage(page, limit, count)
            const previousPage = HPagination.getPreviousPage(page)

            const pagination: IEmpresaPaginate = {
                currentPage: page,
                limit,
                totalPages,
                totalItems: count,
                nextPage,
                previousPage
            }

            return {
                result: true,
                data: rows,
                pagination,
                status: 200
            }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getById(id: number): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id, {
                attributes: EMPRESA_ATTRIBUTES
            })

            if (!empresa) {
                return { result: false, data: [], message: 'Empresa no encontrada', status: 200 }
            }
            return { result: true, data: empresa, message: 'Empresa encontrada', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async create(data: IEmpresa): Promise<EmpresaResponse> {
        try {
            const newEmpresa = await Empresa.create(data as IEmpresa)

            const { id } = newEmpresa

            if (id) {
                return { result: true, message: 'Empresa registrada con éxito', data: newEmpresa, status: 200 }
            }

            return { result: false, message: 'Error al registrar la empresa', status: 500 }

        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async update(id: number, data: IEmpresa): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id)

            if (!empresa) {
                return { result: false, message: 'Empresa no encontrada', status: 200 }
            }

            const dataEmpresa: Partial<IEmpresa> = data

            const updatedEmpresa = await empresa.update(data)

            return { result: true, message: 'Empresa actualizada con éxito', data: updatedEmpresa, status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage }
        }
    }

    async delete(id: number): Promise<EmpresaResponse> {
        try {
            const empresa = await Empresa.findByPk(id);

            if (!empresa) {
                return { result: false, data: [], error: 'Empresa no encontrada', status: 200 };
            }

            await empresa.destroy();

            return { result: true, data: { id }, message: 'Empresa eliminada correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage };
        }
    }
}

export default new EmpresaRepository() 