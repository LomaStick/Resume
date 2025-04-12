import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';


const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Маршрут для главной страницы */}
                <Route path="/" element={<Home />} />

                {/* Маршрут для перенаправления на главную страницу при переходе на несуществующий роут */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
};

export default App;

