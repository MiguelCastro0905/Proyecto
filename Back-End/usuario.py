from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, status, HTTPException , Query
import hashlib 
from conexion import cursor, mydb
from datetime import datetime
import mysql.connector
from typing import Optional

userRouter = APIRouter()

class CarnetUsuario(BaseModel):
    Id_Usuario: int
    Nombre: str
    Apellido: str
    Rol: str
    Tipo_Identificacion: str
    Numero_Identificacion: int
    RH: str
    ficha: int
    Fecha_Expiracion: datetime
    foto: str
    CodigoQR: str

class UsuarioGet(BaseModel):
    Id_Usuario: int
    Nombre: str
    Apellido: str
    Rol : str

class UsuarioCrear(BaseModel):
    Nombre: str
    Apellido: str
    Correo: EmailStr
    Contraseña: str
    TipoIdentificacion: str
    NumeroIdentificacion: str
    Rol: str
    Edad: int
    RH: str

# NUEVO: Modelo para actualización
class UsuarioActualizar(BaseModel):
    Nombre: Optional[str]
    Apellido: Optional[str]
    Correo: Optional[EmailStr]
    Contraseña: Optional[str]
    TipoIdentificacion: Optional[str]
    NumeroIdentificacion: Optional[str]
    Rol: Optional[str]
    Edad: Optional[int]
    RH: Optional[str]

@userRouter.get("/users/{Id_Usuario}", status_code=status.HTTP_200_OK)
def get_user_by_id(Id_Usuario: int):
    select_query = "SELECT * FROM usuario WHERE Id_Usuario = %s"
    cursor.execute(select_query, (Id_Usuario,))
    result = cursor.fetchall()
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="User not found")
    
@userRouter.post("/login", status_code=status.HTTP_200_OK)
def validate_information(correo: str = Query(...), contrasena: str = Query(...)):
    hashed_password = hashlib.sha256(contrasena.encode()).hexdigest()
    
    select_query = """
    SELECT u.Id_Usuario, u.Nombre, u.Apellido, u.Rol, u.Tipo_Identificacion, u.Numero_Identificacion, u.RH, 
           c.ficha, c.Fecha_Expiracion, c.foto, c.CodigoQR
    FROM usuario u 
    INNER JOIN carnet c ON (u.Id_usuario = Fk_Id_Usuario) 
    WHERE u.correo = %s AND u.contraseña = %s
    """
    values = (correo, hashed_password)
    
    try:
        cursor.execute(select_query, values)
        result = cursor.fetchone()
        
        if result:
            usuario = CarnetUsuario(
                Id_Usuario=result[0],
                Nombre=result[1],
                Apellido=result[2],
                Rol=result[3],
                Tipo_Identificacion=result[4],
                Numero_Identificacion=result[5],
                RH=result[6],
                ficha=result[7],
                Fecha_Expiracion=result[8],
                foto=result[9],
                CodigoQR=result[10],
            )
            return usuario
        else:
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error del servidor: {err}")
    
@userRouter.post("/crear", status_code=status.HTTP_201_CREATED)
def crear_usuario(usuario: UsuarioCrear):
    hashed_password = hashlib.sha256(usuario.Contraseña.encode()).hexdigest()

    insert_query = """
    INSERT INTO usuario 
    (Nombre, Apellido, Correo, Contraseña, Tipo_Identificacion, Numero_Identificacion, Rol, Edad, RH)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
    """
    values = (
        usuario.Nombre,
        usuario.Apellido,
        usuario.Correo,
        hashed_password,
        usuario.TipoIdentificacion,
        usuario.NumeroIdentificacion,
        usuario.Rol,
        usuario.Edad,
        usuario.RH
    )

    try:
        cursor.execute(insert_query, values)
        mydb.commit()
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=f"Error al crear el usuario: {err}")

    return {"message": "Usuario creado correctamente"}

# NUEVO: Endpoint para actualizar usuario
@userRouter.patch("/users/{Id_Usuario}", status_code=status.HTTP_200_OK)
def actualizar_usuario(Id_Usuario: int, usuario: UsuarioActualizar):
    campos = []
    valores = []

    if usuario.Nombre:
        campos.append("Nombre = %s")
        valores.append(usuario.Nombre)
    if usuario.Apellido:
        campos.append("Apellido = %s")
        valores.append(usuario.Apellido)
    if usuario.Correo:
        campos.append("Correo = %s")
        valores.append(usuario.Correo)
    if usuario.Contraseña:
        hashed_password = hashlib.sha256(usuario.Contraseña.encode()).hexdigest()
        campos.append("Contraseña = %s")
        valores.append(hashed_password)
    if usuario.TipoIdentificacion:
        campos.append("Tipo_Identificacion = %s")
        valores.append(usuario.TipoIdentificacion)
    if usuario.NumeroIdentificacion:
        campos.append("Numero_Identificacion = %s")
        valores.append(usuario.NumeroIdentificacion)
    if usuario.Rol:
        campos.append("Rol = %s")
        valores.append(usuario.Rol)
    if usuario.Edad is not None:
        campos.append("Edad = %s")
        valores.append(usuario.Edad)
    if usuario.RH:
        campos.append("RH = %s")
        valores.append(usuario.RH)

    if not campos:
        raise HTTPException(status_code=400, detail="No se proporcionaron campos para actualizar")

    valores.append(Id_Usuario)
    query = f"UPDATE usuario SET {', '.join(campos)} WHERE Id_Usuario = %s"

    try:
        cursor.execute(query, tuple(valores))
        mydb.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

        return {"message": "Usuario actualizado correctamente"}
    
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error del servidor: {err}")
