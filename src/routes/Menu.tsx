import React, {useState, useEffect} from 'react';
import {getMenuList} from '../MenuItem';
import {List} from '@mui/material';

function Menu() {
    const [menus, setMenus]: [any, any] = useState([]);

    useEffect(() => {
        const interval = setInterval(updateMenu, 30000);

        updateMenu();

        function updateMenu() {
            const date = new Date();
            fetch('https://dash-sv.jeppevinkel.com/menu')
                .then((res) => res.json())
                .then((data) => setMenus(date.getHours() >= 13 ? data.menu.slice(1) : data.menu))
                .catch(err => console.error(err));
        }

        return () => {
            clearInterval(interval);
        };
    }, []);


    return (
        <List sx={{paddingTop: 0}}>
            {getMenuList(menus)}
        </List>
    );
}

export default Menu;