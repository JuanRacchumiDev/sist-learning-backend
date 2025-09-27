import fs from 'fs';
import { CertificadoUploadResponse, ICertificadoUpload } from "../../../app/interfaces/CertificadoUpload/ICertificadoUpload";
import { CertificadoUpload } from "../../../app/models/certificadoUpload.models";
import { CERTIFICADO_UPLOAD_ATTRIBUTES } from "../../../constants/CertificadoUploadConstant";
import { ALUMNO_INCLUDE } from '../../../includes/AlumnoInclude';
import { EVENTO_INCLUDE } from '../../../includes/EventoInclude';
import { TIPO_CERTIFICADO_INCLUDE } from '../../../includes/TipoCertificadoInclude';

class CertificadoUploadRepository {
    async getByAlumnoIdEventoId(idAlumno: number, idEvento: number): Promise<CertificadoUploadResponse> {
        try {
            const certificado = await CertificadoUpload.findOne({
                where: {
                    id_alumno: idAlumno,
                    id_evento: idEvento
                }
            })

            if (!certificado) {
                return { result: false, data: [], message: 'Certificado no encontrado', status: 200 }
            }

            return { result: true, data: certificado, message: 'Certificado encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async getByCodigo(codigo: string): Promise<CertificadoUploadResponse> {
        try {
            const certificado = await CertificadoUpload.findOne({
                where: { codigo },
                attributes: CERTIFICADO_UPLOAD_ATTRIBUTES,
                include: [
                    ALUMNO_INCLUDE,
                    EVENTO_INCLUDE,
                    TIPO_CERTIFICADO_INCLUDE
                ]
            })

            if (!certificado) {
                return { result: false, data: [], message: 'Certificado no encontrado', status: 200 }
            }

            return { result: true, data: certificado, message: 'Certificado encontrado', status: 200 }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async downloadByName(filename: string) {
        try {
            const certificado = await CertificadoUpload.findOne({
                where: { file_name: filename }
            })

            if (!certificado) {
                return {
                    result: false,
                    message: 'Certificado no encontrado',
                    outputPath: null,
                    filename: null,
                    status: 404
                }
            }

            const { id, id_alumno, file_path } = certificado

            const pathFilename = file_path as string

            if (fs.existsSync(pathFilename)) {
                return {
                    result: true,
                    message: 'Certificado encontrado con éxito',
                    outputPath: pathFilename,
                    filename,
                    id,
                    id_alumno,
                    status: 200
                }
            } else {
                return {
                    result: false,
                    message: 'Archivo de certificado no encontrado en el sistema de archivos',
                    outputPath: null,
                    filename: null,
                    status: 404
                };
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async upload(data: ICertificadoUpload): Promise<CertificadoUploadResponse> {
        try {
            const newCertificado = await CertificadoUpload.create(data as ICertificadoUpload)

            if (newCertificado.id) {
                return {
                    result: true,
                    message: 'Adjunto registrado con éxito',
                    data: newCertificado,
                    status: 200
                }
            }

            return {
                result: false,
                error: "Error al registrar el certificado",
                data: [],
                status: 500
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 }
        }
    }

    async delete(id: number): Promise<CertificadoUploadResponse> {
        try {
            const certificado = await CertificadoUpload.findByPk(id);

            if (!certificado) {
                return { result: false, message: 'Certificado no encontrado', data: [], status: 200 };
            }

            await certificado.destroy();

            return { result: true, data: { id }, message: 'Certificado eliminado correctamente', status: 200 };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            return { result: false, error: errorMessage, status: 500 };
        }
    }
}

export default new CertificadoUploadRepository()