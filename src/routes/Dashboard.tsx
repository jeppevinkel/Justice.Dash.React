import React, { useState, useEffect } from 'react';
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
import Window from '../Window';
import staticPuzzle from '../images/static-puzzle.png';
import { WeatherGraph } from '../WeatherGraph';
import win7bg from '../images/win7bg.jpg';
import { useNavigate, useParams } from 'react-router-dom';
import flowerPot from '../images/flower-pot.png'; // You'll need to add this image

function Dashboard() {
    const [menus, setMenus]: [any, any] = useState([]);
    const [surveillance, setSurveillance] = useState<{
        mdm: { type: string, week: number, year: number, responsible: string }[],
        edi: { type: string, week: number, year: number, responsible: string }[],
        week: number
    }>({ mdm: [], edi: [], week: NaN });
    const [showBrunsviger, setShowBrunsviger] = useState(false);
    const [brunsvigerProgress, setBrunsvigerProgress] = useState(0);
    const [showBrunsvigerSoon, setShowBrunsvigerSoon] = useState(false);
    const [brunsvigerSoonProgress, setBrunsvigerSoonProgress] = useState(0);
    const [domicileImages, setDomicileImages] = useState<{
        path: string,
        imageUpdateDate: number,
        albumAddDate: number,
        width: number,
        height: number,
        uid: string
    }[]>([]);
    const [isVegan, setIsVegan] = useState(false);
    const [isJustice, setIsJustice] = useState(false);
    const [weatherId, setWeatherId] = useState('2-2615876');
    const [activeTeamName, setActiveTeamName] = useState('');
    const numberOfMenuItems = 5;
    const navigate = useNavigate();
    const {teamName} = useParams();

    // ... (keep all other useEffect hooks except the clock-related one)

    const defaultTheme = createTheme({
        palette: {
            mode: 'light'
        }
    });

    return (
        <div className="App" style={{
            backgroundImage: `url(${win7bg})`,
            backgroundSize: 'cover'
        }}>
            <ThemeProvider theme={defaultTheme}>
                <Box sx={{ display: 'flex' }}>
                    <CssBaseline />
                    <Box
                        component="main"
                        sx={{
                            flexGrow: 1,
                            height: '100vh',
                            overflow: 'hidden',
                        }}
                    >
                        <Grid container spacing={3} paddingLeft={2} paddingTop={2} direction={'row'}
                            justifyContent={'space-between'}>
                            {/* First two grid sections remain unchanged */}
                            <Grid item container direction={'column'} height={'105vh'} paddingRight={2} gap={1.5}
                                xs={'auto'} md={'auto'} lg={'auto'} className={'window glass'}>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <img 
                                        src={flowerPot} 
                                        alt="Flower Pot" 
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            objectFit: 'contain'
                                        }}
                                    />
                                </div>
                                {!isNaN(surveillance.week) && <div>
                                    <fieldset style={{backgroundColor: 'white', textAlign: 'center', fontSize: '24px'}}>
                                        <legend style={{fontSize: '16px'}}>Uge nummer</legend>
                                        <p style={{marginTop: 0, marginBottom: 0}}><b>{surveillance.week}</b></p>
                                    </fieldset>
                                </div>}
                                <div style={{
                                    marginTop: '16px',
                                }}>
                                    <img width={'200px'} src={staticPuzzle} alt={'Pelican puzzle'} />
                                </div>
                                <div>
                                    <fieldset style={{backgroundColor: 'white', textAlign: 'center', fontSize: '24px'}}>
                                        <legend style={{fontSize: '16px'}}>PI</legend>
                                        <p style={{marginTop: 0, marginBottom: 0}}><b>12</b></p>
                                    </fieldset>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </ThemeProvider>
        </div>
    );
}

export default Dashboard;