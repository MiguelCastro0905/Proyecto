from pydantic import BaseModel
from fastapi import APIRouter, status, HTTPException
import hashlib 
from conexion import cursor, mydb
import mysql.connector

regisRouter = APIRouter()

class RegistroUsuario(BaseModel):
    correo: str
    contrasena: str

@regisRouter.post("/registro", status_code=status.HTTP_201_CREATED)
def insert_user(user: RegistroUsuario):
    hashed_password = hashlib.sha256(user.contrasena.encode()).hexdigest()

    insert_query = """
    INSERT INTO registro_usuario (correo, contrasena)
    VALUES (%s, %s)
    """
    values = (user.correo, hashed_password)

    try:
        cursor.execute(insert_query, values)
        mydb.commit()
    except mysql.connector.Error as err:
        raise HTTPException(status_code=400, detail=f"Error: {err}")

    return {"message": "Usuario registrado correctamente"}