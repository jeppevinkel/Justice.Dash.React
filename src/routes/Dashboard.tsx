import React, {useState, useEffect} from 'react';
import '../Clock.css';
import {filterMenu, getMenuList} from '../MenuItem';
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
import {WeatherGraph} from '../WeatherGraph';

function Dashboard() {
    const [menus, setMenus]: [any, any] = useState([]);
    const [surveillance, setSurveillance]: [any, any] = useState({mdm: {}, edi: {}});
    const [clockValue, setClockValue] = useState(new Date());
    const [showBrunsviger, setShowBrunsviger] = useState(false);
    const [brunsvigerProgress, setBrunsvigerProgress] = useState(0);
    const numberOfMenuItems = 5;

    useEffect(() => {
        const interval = setInterval(updateMenu, 30000);
        // const interval = setInterval(updateMenu, 300);

        updateMenu();

        function updateMenu() {
            fetch('/api/menu')
                .then((res) => res.json())
                .then((data) => setMenus(filterMenu(data.menu)))
                .catch(err => console.error(err));
        }

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        updateSurveillance();

        const interval = setInterval(() => {
            updateSurveillance();
        }, 30000);

        function updateSurveillance() {
            fetch('/api/surveillance')
                .then((res) => res.json())
                .then((data) => setSurveillance({mdm: data.mdm, edi: data.edi}))
                .catch(err => console.error(err));
        }

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => setClockValue(new Date()), 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const day = now.getDay();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            const timeFromNine = (hours - 9) * 60 + minutes;

            if (day === 4 && timeFromNine >= 45 && timeFromNine < 120) {
                const progress = ((timeFromNine - 45) / (120 - 45)) * 100;
                setBrunsvigerProgress(progress);
                setShowBrunsviger(true);
            } else {
                setShowBrunsviger(false);
            }
        }, 10000);

        return () => {
            clearInterval(interval);
        };
    }, [showBrunsviger]);

    const defaultTheme = createTheme({
        palette: {
            mode: 'light'
        }
    });

    if (window.location.hash !== 'brunsviger-dialog') {
        // navigate('#brunsviger-dialog')
        // window.location.hash = 'brunsviger-dialog';
    }

    return (
        <div className="App" style={{
            backgroundImage: `url(${menus[0]?.image?.path}`,
            backgroundSize: 'cover'
        }}>
            <ThemeProvider theme={defaultTheme}>
                <Box sx={{display: 'flex'}}>
                    <CssBaseline/>
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
                            <Grid item container direction={'column'} gap={1.5} maxWidth={'none !important'} xs={4}
                                  md={4} lg={4}>
                                <Window title={'Madplan'}>
                                    <List sx={{paddingTop: 0}}>
                                        {getMenuList(menus, numberOfMenuItems)}
                                    </List>
                                </Window>
                                <div className="window glass active is-bright" id="brunsviger-dialog" role="dialog"
                                     aria-labelledby="brunsviger-dialog-title"
                                     style={{
                                         opacity: showBrunsviger ? 1 : 0,
                                         visibility: showBrunsviger ? 'visible' : 'hidden'
                                     }}>
                                    <div className="title-bar">
                                        <div className="title-bar-text" id="brunsviger-dialog-title">Brunsviger
                                            deployment
                                        </div>
                                        <div className="title-bar-controls">
                                            <button aria-label="Close"
                                                    onClick={() => setShowBrunsviger(false)}></button>
                                        </div>
                                    </div>
                                    <div className="window-body has-space">
                                        <h2 className="instruction instruction-primary">Brunsviger deployment
                                            igangsat...</h2>
                                        <div role="progressbar" className="animate">
                                            <div style={{width: brunsvigerProgress + '%'}}></div>
                                        </div>
                                    </div>
                                    <footer style={{textAlign: 'right'}}>
                                        <button onClick={() => setShowBrunsviger(false)}>Cancel</button>
                                    </footer>
                                </div>

                                <Window sx={{width: 'fit-content'}} title={'Vejret'}>
                                    <WeatherGraph/>
                                </Window>
                            </Grid>

                            <Grid item container direction={'column'} gap={1.5} maxWidth={'none !important'} xs={4}
                                  md={4} lg={4}>
                                {surveillance?.mdm &&
                                    <Window sx={{width: '100%'}}
                                            title={`Overvågning${surveillance?.mdm[0]?.week !== undefined ? ' - uge ' + surveillance?.mdm[0].week : ''}`}>
                                        <Stack sx={{paddingY: 1}} direction={'row'}
                                               divider={<Divider orientation="vertical" flexItem/>}>
                                            <ListItemText sx={{paddingLeft: 2}}
                                                          primary={surveillance?.mdm[0]?.responsible}
                                                          secondary={'MDM'}/>
                                            <ListItemText sx={{paddingLeft: 2}}
                                                          primary={surveillance?.edi[0]?.responsible}
                                                          secondary={'Batch/EDI'}/>
                                        </Stack>
                                    </Window>}
                            </Grid>

                            <Grid item container direction={'column'} height={'105vh'} paddingRight={2} gap={1.5}
                                  xs={'auto'} md={'auto'} lg={'auto'} className={'window glass'}>
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center'
                                }}>
                                    <Clock size={200} value={clockValue}
                                           secondHandWidth={3} secondHandLength={75} secondHandOppositeLength={25}
                                           minuteHandWidth={6} minuteHandLength={80} minuteHandOppositeLength={20}
                                           hourHandWidth={8} hourHandLength={60} hourHandOppositeLength={20}/>
                                </div>
                                <div style={{
                                    marginTop: '16px',
                                }}>
                                    <img width={'200px'} src={staticPuzzle} alt={'Pelican puzzle'}/>
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
