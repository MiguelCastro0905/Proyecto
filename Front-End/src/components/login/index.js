import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './index.css';
import image1 from '../../image/LogoSENA.png';

const Login = ({ onLogin }) => {
    const [selectedRole, setSelectedRole] = useState('Elegir Rol');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        setSelectedRole(role);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        
        // Validación de campos
        if (selectedRole === 'Elegir Rol') {
            setMessage('Por favor selecciona un rol antes de iniciar sesión');
            return;
        }
        
        if (!correo || !contrasena) {
            setMessage('Por favor, complete todos los campos.');
            return;
        }

        try {
            // Llamada a la API de autenticación
            await onLogin(correo, contrasena);
            
            // Navegación según el rol seleccionado
            switch (selectedRole) {
                case 'Aprendiz':
                    navigate('/carnetAprendiz');
                    break;
                case 'Instructor':
                    navigate('/carnetInstructor');
                    break;
                case 'Administrativos':
                    navigate('/carnetAdministrativo');
                    break;
                case 'Administrador':
                    navigate('/carnetAdministrador');
                    break;
                default:
                    setMessage('Rol no válido');
            }
        } catch (error) {
            setMessage(`Error al iniciar sesión: ${error.message}`);
        }
    };

    return (
        <div className="App">
            <div className="cuadro-inferior1">
                <div className="recuadro"></div>
            </div>
            {/* Contenedor principal para centrar el contenido */}
            <div className="login-container">
                <div className="container2">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="recuadroDer p-4">
                                <h2 className="text-center">LOGIN</h2>
                                <div className="recuadro2 p-3">
                                    {message && <p style={{ color: 'red', textAlign: 'center' }}>{message}</p>}
                                    
                                    {/* Dropdown para seleccionar el rol */}
                                    <div className="row">
                                        <div className="col-sm-12 mb-3">
                                            <div className="dropdown">
                                                <button
                                                    className="btn btn-secondary dropdown-toggle w-100"
                                                    type="button"
                                                    id="dropdownMenuButton"
                                                    data-bs-toggle="dropdown"
                                                    aria-expanded="false"
                                                >
                                                    <div className="Elegir_rol">{selectedRole}</div>
                                                </button>
                                                <ul className="dropdown-menu w-100" aria-labelledby="dropdownMenuButton">
                                                    <li>
                                                        <a
                                                            className="dropdown-item"
                                                            href="#"
                                                            onClick={() => handleRoleSelect('Aprendiz')}
                                                        >
                                                            Aprendiz
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className="dropdown-item"
                                                            href="#"
                                                            onClick={() => handleRoleSelect('Instructor')}
                                                        >
                                                            Instructor
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className="dropdown-item"
                                                            href="#"
                                                            onClick={() => handleRoleSelect('Administrativos')}
                                                        >
                                                            Administrativos
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            className="dropdown-item"
                                                            href="#"
                                                            onClick={() => handleRoleSelect('Administrador')}
                                                        >
                                                            Administrador
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Campo de correo institucional */}
                                    <div className="row">
                                        <div className="col-sm-12 mb-3">
                                            <div className="form-group">
                                                <input 
                                                    className="form-control" 
                                                    placeholder="Correo Institucional" 
                                                    id="email"
                                                    value={correo}
                                                    onChange={(e) => setCorreo(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Campo de contraseña */}
                                    <div className="row">
                                        <div className="col-sm-12 mb-3">
                                            <div className="form-group">
                                                <input 
                                                    type="password" 
                                                    className="form-control" 
                                                    placeholder="Contraseña" 
                                                    id="password"
                                                    value={contrasena}
                                                    onChange={(e) => setContrasena(e.target.value)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* Botón de iniciar sesión */}
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-primary btn-block"
                                            onClick={handleLogin}
                                        >
                                            Iniciar sesión
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Imagen añadida aquí */}
                <div className="logo-container">
                    <img src={image1} alt="Logo" className="login-logo" />
                </div>
            </div>
            <div className="cuadro-inferior2">
                <div className="recuadro"></div>
            </div>
        </div>
    );
};

export default Login;