from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, status, HTTPException , Query
import hashlib 
from conexion import cursor, mydb
from datetime import datetime
import mysql.connector

userRouter = APIRouter()

class UsuarioGet(BaseModel):
    Id_Usuario: int
    Nombre: str
    Apellido: str
    Rol : str
    
class UsuarioCrear(BaseModel):
    Id_Usuario:int
    Nombre: str
    Apellido: str
    Correo: EmailStr
    Contraseña: str
    Rol: str
    Edad: int
    RH: str

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
      # Hashear la contraseña
    hashed_password = hashlib.sha256(contrasena.encode()).hexdigest()
    
    select_query = """
    select Id_Usuario, Nombre, Apellido, Rol
    FROM usuario
    WHERE correo = %s AND contraseña = %s
    """
    values = (correo, hashed_password)
    
    try:
        cursor.execute(select_query, values)
        result = cursor.fetchone()
        
        if result:
            usuario = UsuarioGet(
                Id_Usuario=result[0],
                Nombre=result[1],
                Apellido=result[2],
                Rol=result[3]
            )
            print(usuario)
            
            # Registrar el ingreso en la tabla ingreso
            # now = datetime.now().strftime('%Y-%m-%d %H:%M:%S')  # formato adecuado para DATETIME
            # print(now)
            # insert_ingreso = """
            # INSERT INTO ingreso (FechaEntrada, Fk_Id_Carnet)
            # VALUES (%s, %s)
            # """
            # values_ingreso = (now, usuario.Id_Usuario)
            
            # cursor.execute(insert_ingreso, values_ingreso)
            # mydb.commit()
            return {"message": "Inicio de sesión exitoso"}
        else:
            raise HTTPException(status_code=401, detail="Correo o contraseña incorrectos")
        
    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error del servidor: {err}")
    
@userRouter.post("/crear", status_code=status.HTTP_201_CREATED)
def crear_usuario(usuario: UsuarioCrear):
     # Hashear la contraseña
    hashed_password = hashlib.sha256(usuario.Contraseña.encode()).hexdigest()

    insert_query = """
    INSERT INTO usuario (Id_Usuario, Nombre, Apellido, Correo, Contraseña, Rol, Edad, RH)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """
    # Si el Id_Usuario es auto-incremental, no necesitas pasarlo aquí
    values = (usuario.Id_Usuario, usuario.Nombre, usuario.Apellido, usuario.Correo, hashed_password, usuario.Rol, usuario.Edad, usuario.RH)

    try:
        cursor.execute(insert_query, values)
        mydb.commit()
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=f"Error al crear el usuario: {err}")

    return {"message": "Usuario creado correctamente"}