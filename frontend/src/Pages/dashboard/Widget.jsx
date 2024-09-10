//Widget.jsx
import React from 'react';

const Widget = ({ type }) => {
  switch (type) {
    case 'tasks':
      return <div className="widget">Lista To-Do</div>;
    case 'calendar':
      return <div className="widget">Calendario</div>;
    case 'weather':
      return <div className="widget">Meteo</div>;
    case 'news':
      return <div className="widget">Notizie</div>;
    default:
      return <div className="widget">Widget sconosciuto</div>;
  }
};

export default Widget;
