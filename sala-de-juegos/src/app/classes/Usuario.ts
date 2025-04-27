export class Usuario
{
    correo: string;
    nombre: string;
    apellido: string;
    edad: number;
    uid: any;

    constructor(correo: string, nombre: string, apellido: string, edad: number, uid: any)
    {
        this.correo = correo;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.uid = uid;
    }
}