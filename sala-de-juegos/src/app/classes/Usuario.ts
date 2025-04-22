export class Usuario
{
    uid: any;
    correo: string;
    nombre: string;
    apellido: string;
    edad: number;
    constructor(correo: string, nombre: string, apellido: string, edad: number, uid: any)
    {
        this.correo = correo;
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.uid = uid;
    }
    mostrarDatos()
    {
        console.log(this.uid, this.correo, this.nombre, this.apellido, this.edad);
    }
}