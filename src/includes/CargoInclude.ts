import { Cargo } from "../app/models/cargo.models";

export const CARGO_INCLUDE = {
    model: Cargo,
    as: 'cargo',
    attributes: ['id', 'nombre']
}