export type TCertificado = {
    outputPath?: string
    fileName?: string
    codigoQR?: string
    codigo?: string
}

export type TResponseCertificado = {
    result?: boolean,
    message?: string,
    error?: string,
    dataResult?: TCertificado
}