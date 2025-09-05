import { Instructor } from "../app/models/instructor.models";

export const INSTRUCTOR_INCLUDE = {
    model: Instructor,
    as: 'instructor',
    attributes: [
        'id',
        'apellido_paterno',
        'apellido_materno',
        'nombres',
        'nombre_capitalized'
    ]
}