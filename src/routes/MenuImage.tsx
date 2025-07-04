import React, { useState, useEffect } from 'react';
import { filterMenu } from '../MenuItem';
import Window from '../Window';
import win7bg from '../images/win7bg.jpg';
import { useNavigate } from 'react-router-dom';

function MenuImage() {
    const [menus, setMenus]: [any, any] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(updateMenu, 30000);
        // const interval = setInterval(updateMenu, 300);

        updateMenu();

        function updateMenu() {
            fetch('/api/menu')
                .then((res) => res.json())
                .then((data) => setMenus(filterMenu(data)))
                .catch(err => console.error(err));
        }

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundImage: `url(${win7bg})`}}>
            <Window title={`Madbillede${menus[0]?.foodModifier ? ` (${menus[0].foodModifier.title})` : ''}`} maximized={true} fullscreen={true} sx={{
                margin: '24px',
                height: 'calc(100vh - 48px)',
                top: 0,
                position: 'absolute',
                width: 'calc(100vw - 48px)'
            }} maximizeCallback={() => navigate(-1)}>
                <img width={'100%'} alt='AI visualisering af dagens mad' src={menus[0]?.image?.path} />
            </Window>
        </div>
    );
}

export default MenuImage;