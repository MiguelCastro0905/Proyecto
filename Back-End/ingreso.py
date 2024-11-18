from pydantic import BaseModel
from conexion import cursor
from fastapi import APIRouter, status, HTTPException

ingressRouter = APIRouter()

class Ingreso(BaseModel):
    Id_ingreso: int
    FechaEntrada: str
    FechaSalida: str
    Fk_Id_carnet: str
    Numero_Identidad: int
    Edad: int
    RH: str