from pydantic import BaseModel
from conexion import cursor
from fastapi import APIRouter, status, HTTPException
from datetime import date

carnetRouter = APIRouter()

class Carnet(BaseModel):
    Id_Carnet : int
    Ficha : int
    Tipo_Identificacion: str
    Numero_Identificacion: int
    Fecha_Expiracion: date
    CodigoQR: str

@carnetRouter.get("/carnet/{Id_Carnet}", status_code=status.HTTP_200_OK)
def get_user_by_id(Id_Carnet: int):
    select_query = "SELECT * FROM Carnet WHERE Id_Carnet = %s"
    cursor.execute(select_query, (Id_Carnet,))
    result = cursor.fetchall()
    if result:
        return result
    else:
        raise HTTPException(status_code=404, detail="User not found")