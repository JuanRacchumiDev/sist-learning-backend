export type TCertificado = {
    outputPath?: string
    filename?: string
    codigo_qr?: string
    codigo?: string
}

export type TResponseCertificado = {
    result?: boolean,
    message?: string,
    error?: string,
    dataResult?: TCertificado
}