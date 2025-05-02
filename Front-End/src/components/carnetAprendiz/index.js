import './index.css';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

const CarnetAprendiz = () => {
    const location = useLocation();
    const usuarioInfo = location.state?.user;
    console.log(usuarioInfo.Nombre);

    const [imageData, setImageData] = useState(null);

    const fechaObj = new Date(usuarioInfo.Fecha_Expiracion); // Convertir string a Date
    const fechaFormateada = fechaObj.toISOString().split('T')[0]; 
    

    useEffect(() => {
        // Hacer la solicitud GET para obtener la imagen con el ID usando fetch
        fetch(`http://127.0.0.1:8000/ver_foto/${usuarioInfo.Id_Usuario}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener la imagen');
            }
            return response.blob(); // Convertir la respuesta a blob
          })
          .then(blob => {
            // Crear una URL para el archivo binario
            const imageUrl = URL.createObjectURL(blob);
            setImageData(imageUrl); // Guardar la URL generada en el estado
          })
          .catch(error => console.error('Error al obtener la imagen', error));
      }, [usuarioInfo.Id_Usuario]);

      const [imageDataQR, setImageDataQR] = useState(null);
      useEffect(() => {
        // Hacer la solicitud GET para obtener la imagen con el ID usando fetch
        fetch(`http://127.0.0.1:8000/ver_qr/${usuarioInfo.Id_Usuario}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener la imagen');
            }
            return response.blob(); // Convertir la respuesta a blob
          })
          .then(blob => {
            // Crear una URL para el archivo binario
            const imageUrl = URL.createObjectURL(blob);
            setImageDataQR(imageUrl); // Guardar la URL generada en el estado
          })
          .catch(error => console.error('Error al obtener la imagen', error));
      }, [usuarioInfo.Id_Usuario]);

    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        codigo: '',
        programa: '',
        rol: '',
        fechaNacimiento: '',
        foto: null
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData(prev => ({
            ...prev,
            foto: reader.result
            }));
        };
        reader.readAsDataURL(file);
        }
    };

    return (
        <div className="carnet-container">
        <div className="carnet-card">
            <div className="carnet-header">
            <h2>Carnet Institucional</h2>
            </div>
            
            <div className="carnet-body">
            <div className="row">
                <div className="col-md-4">
                <div className="photo-container">
                    <div>
                        {imageData ? (
                            <img src={imageData} alt="Imagen del usuario" style={{ width: '100%', height: 'auto' }} />
                        ) : (
                            <p>Cargando imagen...</p>
                        )}
                    </div>
                </div>
                </div>

                <div className="col-md-6">
                <div className="form-group">
                    <label>Rol: {usuarioInfo.Rol}</label>
                </div>
                </div>
                
                <div className="col-md-8">
                <div className="form-group">
                    <label>Nombres: {usuarioInfo.Nombre}</label>
                </div>
                
                <div className="form-group">
                    <label>Apellidos: {usuarioInfo.Apellido} </label>
                </div>
                <div className="form-group">
                    <label>Tipo de identificacion: {usuarioInfo.Tipo_Identificacion} </label>
                </div>
                <div className="form-group">
                    <label>Numero de identificacion: {usuarioInfo.Numero_Identificacion} </label>
                </div>
                <div className="form-group">
                    <label>RH: {usuarioInfo.RH} </label>
                </div>
                <div className="form-group">
                    <label>Ficha: {usuarioInfo.ficha} </label>
                </div>
                <div className="form-group">
                    <label>Fecha expiracion: {fechaFormateada} </label>
                </div>
                <div className="row mt-3">
                <div className="col-md-6">
                <div className="form-group">
                    <label>QR:</label>
                    <div>
                        {imageDataQR ? (
                            <img src={imageDataQR} alt="QR usuario" style={{ width: '100%', height: 'auto' }} />
                        ) : (
                            <p>Cargando imagen...</p>
                        )}
                    </div>
                </div>
                </div>
            </div>
                
                <div className="form-group">
                    <label>Código:</label>
                </div>
                </div>
            </div>
            </div>
            {/* Botón de iniciar sesión */}
            <div className="text-center">
                        <button type="button" className="btn-Exit btn-primary btn-block">
                        Cerrar sesión
                        </button>
                    </div>
            <div className="carnet-footer">
            <p>SENA</p>
            </div>
            
        </div>
        </div>
    );
};

export default CarnetAprendiz;