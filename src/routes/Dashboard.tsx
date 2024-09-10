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
import win7bg from '../images/win7bg.jpg';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
    const [menus, setMenus]: [any, any] = useState([]);
    const [surveillance, setSurveillance] = useState<{
        mdm: { type: string, week: number, year: number, responsible: string }[],
        edi: { type: string, week: number, year: number, responsible: string }[],
        week: number
    }>({ mdm: [], edi: [], week: NaN });
    const [clockValue, setClockValue] = useState(new Date());
    const [showBrunsviger, setShowBrunsviger] = useState(false);
    const [brunsvigerProgress, setBrunsvigerProgress] = useState(0);
    const [showBrunsvigerSoon, setShowBrunsvigerSoon] = useState(false);
    const [brunsvigerSoonProgress, setBrunsvigerSoonProgress] = useState(0);
    const [domicilImageHash, setDomicilImageHash] = useState((new Date().valueOf()));
    const [domicileImages, setDomicileImages] = useState<{
        path: string,
        imageUpdateDate: number,
        albumAddDate: number,
        width: number,
        height: number,
        uid: string
    }[]>([]);
    const numberOfMenuItems = 5;
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

    useEffect(() => {
        updateSurveillance();

        const interval = setInterval(() => {
            updateSurveillance();
            console.log(surveillance);
        }, 30000);

        function updateSurveillance() {
            fetch('/api/surveillance')
                .then((res) => res.json())
                .then((data) => {
                    let week = NaN;

                    if (data.MDM && data.MDM.length > 0) {
                        week = data.MDM[0].week;
                    } else if (data.EDI && data.EDI.length > 0) {
                        week = data.EDI[0].week;
                    }

                    setSurveillance({ mdm: data.MDM, edi: data.EDI, week });
                })
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
        updateDomicilImage();

        const interval = setInterval(updateDomicilImage, 60000);

        function updateDomicilImage() {
            setDomicilImageHash((new Date().valueOf()));
        }

        return () => {
            clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        updateDomicileImages();

        const interval = setInterval(updateDomicileImages, 60000);

        function updateDomicileImages() {
            fetch('/api/domicile')
                .then((res) => res.json())
                .then((data) => data ? setDomicileImages(data) : setDomicileImages([]))
                .catch(err => console.error(err));
        }

        return () => {
            clearInterval(interval);
        }
    }, []);

    useEffect(() => {
        updateBrunsviger();

        const interval = setInterval(() => {
            updateBrunsviger();
        }, 10000);

        function updateBrunsviger() {
            const now = new Date();
            const day = now.getDay();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            let disable = false;

            if (now.getMonth() === 6 && (now.getDate() === 4 || now.getDate() === 11 || now.getDate() === 25)) {
                disable = true;
            }

            const timeFromNine = (hours - 9) * 60 + minutes;

            if (!disable && day === 4 && timeFromNine >= 45 && timeFromNine < 120) {
                const progress = ((timeFromNine - 45) / (120 - 45)) * 100;
                setBrunsvigerProgress(progress);
                setShowBrunsviger(true);
            } else {
                setShowBrunsviger(false);
            }
        }

        return () => {
            clearInterval(interval);
        };
    }, [showBrunsviger]);

    useEffect(() => {
        updateBrunsviger();

        const interval = setInterval(() => {
            updateBrunsviger();
        }, 10000);

        function updateBrunsviger() {
            const now = new Date();
            const day = now.getDay();
            const hours = now.getHours();
            const minutes = now.getMinutes();

            let disable = false;

            if (now.getMonth() === 6 && (now.getDate() === 4 || now.getDate() === 11 || now.getDate() === 25)) {
                disable = true;
            }

            const timeFromNine = (hours - 9) * 60 + minutes;

            if (!disable && day === 4 && timeFromNine >= 30 && timeFromNine < 45) {
                const progress = ((timeFromNine - 30) / (45 - 30)) * 100;
                setBrunsvigerSoonProgress(progress);
                setShowBrunsvigerSoon(true);
            } else {
                setShowBrunsvigerSoon(false);
            }
        }

        return () => {
            clearInterval(interval);
        };
    }, [showBrunsvigerSoon]);

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
                            <Grid item container direction={'column'} gap={1.5} maxWidth={'none !important'} xs={3}
                                md={3} lg={3}>
                                <Window title={'Madplan'}>
                                    <List sx={{ paddingTop: 0 }}>
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
                                            <div style={{ width: brunsvigerProgress + '%' }}></div>
                                        </div>
                                    </div>
                                    <footer style={{ textAlign: 'right' }}>
                                        <button onClick={() => setShowBrunsviger(false)}>Cancel</button>
                                    </footer>
                                </div>

                                <div className="window glass active is-bright" id="brunsviger-dialog" role="dialog"
                                    aria-labelledby="brunsviger-dialog-title"
                                    style={{
                                        opacity: showBrunsvigerSoon ? 1 : 0,
                                        visibility: showBrunsvigerSoon ? 'visible' : 'hidden'
                                    }}>
                                    <div className="title-bar">
                                        <div className="title-bar-text" id="brunsviger-dialog-title">Brunsviger
                                            build pipeline
                                        </div>
                                        <div className="title-bar-controls">
                                            <button aria-label="Close"
                                                onClick={() => setShowBrunsvigerSoon(false)}></button>
                                        </div>
                                    </div>
                                    <div className="window-body has-space">
                                        <h2 className="instruction instruction-primary">Bulding artifacts...</h2>
                                        <div role="progressbar" className="animate">
                                            <div style={{ width: brunsvigerSoonProgress + '%' }}></div>
                                        </div>
                                    </div>
                                    <footer style={{ textAlign: 'right' }}>
                                        <button onClick={() => setShowBrunsvigerSoon(false)}>Cancel</button>
                                    </footer>
                                </div>

                                <Window sx={{ width: 'fit-content' }} title={'Vejret'}>
                                    <WeatherGraph />
                                </Window>
                            </Grid>

                            <Grid item container direction={'column'} gap={1.5} maxWidth={'none !important'} xs={5}
                                md={5} lg={5}>
                                {(surveillance.mdm || surveillance.edi) &&
                                    <Window sx={{ width: '100%' }}
                                        title={`Overvågning${!isNaN(surveillance.week) ? ' - uge ' + surveillance.week : ''}`}>
                                        <Stack sx={{ paddingY: 1 }} direction={'row'}
                                            divider={<Divider orientation="vertical" flexItem />}>
                                            {surveillance.mdm && <ListItemText sx={{ paddingLeft: 2 }}
                                                primary={surveillance.mdm[0]?.responsible}
                                                secondary={'MDM'} />}
                                            {surveillance.edi && <ListItemText sx={{ paddingLeft: 2 }}
                                                primary={surveillance.edi[0]?.responsible}
                                                secondary={'Batch/EDI'} />}
                                        </Stack>
                                    </Window>}
                                <Window title='Madbillede' maximizeCallback={() => navigate('/menu-image')}>
                                    <img width={'100%'} src={menus[0]?.image?.path} />
                                </Window>
                                <Stack direction={'row'}>
                                    <Window sx={{visibility: domicileImages.length > 1 ? 'visible' : 'hidden'}} title='Nyt Domicil (Før)' maximizeCallback={() => navigate('/construction-image-before')}>
                                        <img width={'100%'}
                                             src={domicileImages.length > 1 ? domicileImages[1].path : domicileImages[0].path}/>
                                    </Window>
                                    <Window title='Nyt Domicil (Efter)' maximizeCallback={() => navigate('/construction-image-after')}>
                                        <img width={'100%'} src={domicileImages[0].path} />
                                    </Window>
                                </Stack>
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
                                        hourHandWidth={8} hourHandLength={60} hourHandOppositeLength={20} />
                                </div>
                                <div style={{
                                    marginTop: '16px',
                                }}>
                                    <img width={'200px'} src={staticPuzzle} alt={'Pelican puzzle'} />
                                </div>
                                <div>
                                    <fieldset style={{backgroundColor: 'white', textAlign: 'center', fontSize: '24px'}}>
                                        <legend style={{fontSize: '16px'}}>PI</legend>
                                        <p style={{marginTop: 0, marginBottom: 0}}><b>11</b></p>
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
