import React, { useState } from 'react';
import './index.css';

const Administrativos = () => {
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
                    {formData.foto ? (
                    <img src={formData.foto} alt="Foto" className="photo-preview" />
                    ) : (
                    <div className="photo-placeholder">Foto</div>
                    )}
                    <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="photo-input"
                    />
                </div>
                </div>

                <div className="col-md-6">
                <div className="form-group">
                <label>Rol: Administrativos </label>
                </div>
                </div>
                
                <div className="col-md-8">
                <div className="form-group">
                    <label>Nombres:</label>
                    <input 
                    type="text" 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    className="form-control"
                    />
                </div>
                
                <div className="form-group">
                    <label>Apellidos:</label>
                    <input 
                    type="text" 
                    name="apellido" 
                    value={formData.apellido} 
                    onChange={handleChange} 
                    className="form-control"
                    />
                </div>
                <div className="row mt-3">
                <div className="col-md-6">
                <div className="form-group">
                    <label>Programa:</label>
                    <input 
                    type="text" 
                    name="programa" 
                    value={formData.programa} 
                    onChange={handleChange} 
                    className="form-control"
                    />
                </div>
                </div>
            </div>
                
                <div className="form-group">
                    <label>Código:</label>
                </div>
                </div>
            </div>
            </div>
            
            <div className="carnet-footer">
            <p>SENA</p>
            </div>
        </div>
        </div>
    );
};

export default Administrativos;
