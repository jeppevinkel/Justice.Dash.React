// ... (previous imports remain the same until win7bg import)
// remove the win7bg import and the rest remains the same
import React, { useState, useEffect } from 'react';
import '../Clock.css';
import { filterMenu, getMenuList } from '../MenuItem';
import {
    Box,
    createTheme,
    CssBaseline, Divider,
    Grid,
    List,
    ListItemText,
    Stack,
    ThemeProvider,
} from '@mui/material';
import Clock from 'react-clock';
import Window from '../Window';
import staticPuzzle from '../images/static-puzzle.png';
import { WeatherGraph } from '../WeatherGraph';
import { useNavigate, useParams } from 'react-router-dom';

// ... (rest of the component code remains the same until the return statement)

    return (
        <div className="App" style={{
            backgroundColor: '#008080', // Windows 98 teal background color
            height: '100vh',
            width: '100vw'
        }}>
            <ThemeProvider theme={defaultTheme}>
                // ... (rest of the JSX remains the same)
            </ThemeProvider>
        </div>
    );
}

export default Dashboard;