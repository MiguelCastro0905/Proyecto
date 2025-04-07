import React, { useState } from 'react';
import './index.css';

// Importar componentes de typesCarnets
import Aprendices from './typesCarnets/aprendiz';
import Instructores from './typesCarnets/instructor';
import Administrativos from './typesCarnets/administrativos';

const MenuColumna = () => {
  const [activeItem, setActiveItem] = useState(null);

  const menuItems = [
    { 
      id: 'aprendices',
      title: "CARNET", 
      subtitle: "APRENDICES",
      component: <Aprendices />
    },
    { 
      id: 'instructores',
      title: "CARNET", 
      subtitle: "INSTRUCTORES",
      component: <Instructores />
    },
    { 
      id: 'administrativos',
      title: "CARNET", 
      subtitle: "ADMINISTRATIVOS",
      component: <Administrativos />
    },
    { 
      id: 'soporte',
      title: "SOPORTE", 
      subtitle: "TECNICO",
      content: "Contenido de soporte técnico del sistema"
    }
  ];

  const renderContent = () => {
    if (activeItem === null) {
      return (
        <div className="welcome-message">
          <h2>Bienvenido al Panel de Administración</h2>
          <p>Seleccione una opción del menú para comenzar</p>
        </div>
      );
    }
    
    const selected = menuItems.find(item => item.id === activeItem);
    return selected.component || (
      <div className="content">
        <h2>{selected.title} {selected.subtitle}</h2>
        <p>{selected.content}</p>
      </div>
    );
  };

  return (
    <div className="menu-container">
      <div className="user-info">
        <span className="user-name">Nombre admin</span>
      </div>
      
      <div className="menu-title">HOME</div>
      
      <div className="menu-items">
        {menuItems.map((item) => (
          <div 
            key={item.id}
            className={`menu-item ${activeItem === item.id ? 'active' : ''}`}
            onClick={() => setActiveItem(item.id)}
          >
            <span className="item-title">{item.title}</span>
            <span className="item-subtitle">{item.subtitle}</span>
          </div>
        ))}
      </div>
      
      <div className="content-panel">
        {renderContent()}
      </div>
    </div>
  );
};

export default MenuColumna;