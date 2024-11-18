from pydantic import BaseModel
from conexion import cursor
from fastapi import APIRouter, status, HTTPException

userRouter = APIRouter()

class Usuario(BaseModel):
    Id_Usuario: int
    Nombre: str
    Apellido: str
    Correo: str
    Numero_Identidad: int
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