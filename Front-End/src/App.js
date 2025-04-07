import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/login';
import CarnetAprendiz from './components/carnetAprendiz';
import CarnetAdministrativo from './components/carnetAdministrativo';
import CarnetInstructor from './components/carnetInstructor';
import CarnetAdministrador from './components/carnetAdministrador';

function App() {
  const [message, setMessage] = useState('');

  const handleLogin = async (correo, contrasena) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: correo,
          contrasena: contrasena
        })
      });
  
      if (!response.ok) {
        throw new Error('Error en la solicitud: ' + response.statusText);
      }
  
      const data = await response.json();
      setMessage(`¡Registro exitoso! Bienvenido, ${correo}.`);
  
    } catch (error) {
      setMessage(`Hubo un error al intentar registrarse: ${error.message}`);
    }
  };

  return (
    <div>
      <Login onLogin={handleLogin} />
      {message && (
        <p style={{ color: message.includes('Error') ? 'red' : 'green' }}>
          {message}
        </p>
      )}
    </div>
  );
}
export default App;