import React, { useState } from 'react';
import './index.css';

const Login = ({ onLogin }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if ( !correo || !contrasena) {
      setMessage('Por favor, complete todos los campos.');
      return;
    }

    onLogin(correo, contrasena);
  };

  return (
    <div>
      <div className="App">
        <div className="text-center header">
          <div className="recuadro"></div>
        </div>
        <div className="container2">
          <div className="row">
            <div className="col-sm-6 recuadroIzq d-flex">
              <div className="widht-100"></div>
              <div className="linea-vertical"></div>
            </div>
            <div className="col-sm-5 recuadroDer justify-content-center align-items-center d-flex">
              <div className="container-fluid">
                <h1 className="ps-5">SICRP</h1>
                <div className="mx-auto linea-horizontal" />
                <p className="ms-5">SISTEMA INTEGRADO DE CONTROL DE RECORRIDOS DE POLICIA</p>
                <div className="recuadro2">
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-sm-12 mb-3">
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 mb-3">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Correo"
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-sm-12 mb-3">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Contraseña"
                          value={contrasena}
                          onChange={(e) => setContrasena(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="text-center">
                      <button type="submit" className="btn btn-primary btn-block">
                        INGRESAR
                      </button>
                    </div>
                  </form>
                  {message && <p style={{ color: 'red' }}>{message}</p>}
                </div>
              </div>
            </div>
            <div className="col-sm-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;