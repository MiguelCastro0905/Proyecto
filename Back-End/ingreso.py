from pydantic import BaseModel
from conexion import cursor, mydb
from fastapi import APIRouter, status, HTTPException
from datetime import datetime
import mysql.connector

ingressRouter = APIRouter()

class Ingreso(BaseModel):
    Id_ingreso: int
    FechaEntrada: str
    FechaSalida: str
    

class IngresoSede(BaseModel):
    Fk_Id_Carnet: int
    Fk_Id_Sede: int


@ingressRouter.post("/ingreso-sede", status_code=status.HTTP_201_CREATED)
def registrar_ingreso(data: IngresoSede):
    try:
        fecha_entrada = datetime.now()

        insert_query = """
        INSERT INTO ingresoSedes (FechaEntrada, Fk_Id_Carnet, Fk_Id_Sede)
        VALUES (%s, %s, %s)
        """
        values = (fecha_entrada, data.Fk_Id_Carnet, data.Fk_Id_Sede)

        cursor.execute(insert_query, values)
        mydb.commit()

        return {"message": "Ingreso registrado exitosamente"}

    except mysql.connector.Error as err:
        raise HTTPException(status_code=500, detail=f"Error al registrar el ingreso: {err}")