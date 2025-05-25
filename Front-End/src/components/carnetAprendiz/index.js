import './index.css';
import { useLocation } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CarnetAprendiz = () => {
    const location = useLocation();
    const usuarioInfo = location.state?.user;
    const [imageData, setImageData] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);

    const fechaObj = new Date(usuarioInfo.Fecha_Expiracion);
    const fechaFormateada = fechaObj.toISOString().split('T')[0]; 
    
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/ver_foto/${usuarioInfo.Id_Usuario}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener la imagen');
            }
            return response.blob();
          })
          .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            setImageData(imageUrl);
          })
          .catch(error => console.error('Error al obtener la imagen', error));
      }, [usuarioInfo.Id_Usuario]);

    const [imageDataQR, setImageDataQR] = useState(null);
    useEffect(() => {
        fetch(`http://127.0.0.1:8000/ver_qr/${usuarioInfo.Id_Usuario}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener la imagen');
            }
            return response.blob();
          })
          .then(blob => {
            const imageUrl = URL.createObjectURL(blob);
            setImageDataQR(imageUrl);
          })
          .catch(error => console.error('Error al obtener la imagen', error));
      }, [usuarioInfo.Id_Usuario]);

    const navigate = useNavigate();
    
    const handleLogout = () => {
        navigate('/');
    };

    const toggleFlip = () => {
        setIsFlipped(!isFlipped);
    };

    return (
        <div className="carnet-container">
            {/* Flip Card */}
            <div className={`flip-card ${isFlipped ? 'flipped' : ''}`} onClick={toggleFlip}>
                <div className="flip-card-inner">
                    {/* Front Face - Diseño como la segunda imagen */}
                    <div className="flip-card-front">
                        <div className="carnet-card">
                            <div className="carnet-header">
                                <h1>Carnet Institucional</h1>
                            </div>
                            
                            <div className="carnet-body-front">
                                <div className="photo-container">
                                    {imageData ? (
                                        <img src={imageData} alt="Imagen del usuario" className="user-photo" />
                                    ) : (
                                        <p>Cargando imagen...</p>
                                    )}
                                </div>
                                
                                
                                
                                    <div className="info-row">
                                        <span className="info-value">{usuarioInfo.Rol}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-value">{usuarioInfo.Nombre}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-value">{usuarioInfo.Apellido}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-value">{usuarioInfo.Tipo_Identificacion}. {usuarioInfo.Numero_Identificacion}</span>
                                    </div>

                                    <div className="info-row">
                                        <span className="info-label">RH:</span>
                                        <span className="info-value">{usuarioInfo.RH}</span>
                                    </div>

                                <div className="qr-section">
                                    {imageDataQR ? (
                                        <img src={imageDataQR} alt="QR usuario" className="qr-code" />
                                    ) : (
                                        <p>Cargando QR...</p>
                                    )}
                                </div>
                                
                            </div>
                            <div className="carnet-footer">
                                <p>SENA</p>
                            </div>
                        </div>
                    </div>

                    {/* Back Face - QR y datos adicionales */}
                    <div className="flip-card-back">
                        <div className="carnet-card back">
                            <div className="carnet-header">
                                <h1>Carnet Institucional</h1>
                            </div>
                            
                            <div className="carnet-body-back">
                                <div className="additional-info">
                                   <p>Este carnet es personal e intransferible;
                                    identifica al portador como aprendiz del Servicio Nacional de Aprendizaje SENA. El 
                                    SENA es una entidad que imparte una formacion tecnica profesional y Tecnologica
                                    que forma parte de la Educacion Superior;
                                    Se solicita a las autoridades publicas, civiles y militares prestarle al portador toda la coloboracion para la realizacion de las
                                    actividades de su aprendizaje. Por 
                                    disposicion de las leyes 418 de 1997, 548 de 1991, 642 de 2001 y 1106 de 2006, los
                                    menores de 18 años de edad y los estudiantes de Educacion Superior, No seran incorporados
                                    a filas para presentar el servicio Militar.
                                   </p>
                                    <div className="info-row">
                                        <span className="info-label">Ficha:</span>
                                        <span className="info-value">{usuarioInfo.ficha}</span>
                                    </div>

                                    <h6> ANALISIS Y DESARROLLO 
                                        DE SOFTWARE</h6>
                                    <div className="info-row">
                                        <span className="info-label">vence:</span>
                                        <span className="info-value">{fechaFormateada}</span>
                                    </div>
                                </div>
                                
                              
                            </div>
                            
                            
                        </div>
                    </div>
                </div>
            </div>

            {/* Botón fuera del flip card */}
            <div className="logout-container">
                <button 
                    type="button" 
                    className="btn-Exit"
                    onClick={handleLogout}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default CarnetAprendiz;