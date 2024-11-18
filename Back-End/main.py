from fastapi import FastAPI
import hashlib
from usuario import userRouter
from carnet import carnetRouter
from ingreso import ingressRouter

app = FastAPI()
app.include_router(userRouter)
app.include_router(carnetRouter)
app.include_router(ingressRouter)





