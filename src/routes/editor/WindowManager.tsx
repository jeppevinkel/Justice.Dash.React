import React, {useEffect, useState} from 'react';
import MenuEditor from './MenuEditor';
import ModifierEditor from './ModifierEditor';
import ProgressAdoEditor from './ProgressAdoEditor';
import Window from '../../Window';

interface WindowDefinition {
    id: string;
    title: string;
    component: React.ReactNode;
    isMinimized: boolean;
    isFocused: boolean;
    zIndex: number;
}

function WindowManager() {
    const [windows, setWindows] = useState<WindowDefinition[]>([
        {
            id: 'menu-editor',
            title: 'Menu Editor',
            component: <MenuEditor/>,
            isMinimized: false,
            isFocused: true,
            zIndex: 2,
        },
        {
            id: 'modifier-editor',
            title: 'Food Modifier Editor',
            component: <ModifierEditor/>,
            isMinimized: true,
            isFocused: false,
            zIndex: 1,
        },
        {
            id: 'progress-editor',
            title: 'ADO Progress Editor',
            component: <ProgressAdoEditor/>,
            isMinimized: true,
            isFocused: false,
            zIndex: 0,
        }
    ]);
    const [nextZIndex, setNextZIndex] = useState(2);
    const [clock, setClock] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        function updateClock() {
            setClock(new Date().toLocaleTimeString());
        }

        let interval = setInterval(updateClock, 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    const bringToFront = (windowId: string) => {
        setWindows(current => {
            const newWindows = [...current];
            for (const newWindow of newWindows) {
                newWindow.isFocused = false;
            }
            const windowIndex = newWindows.findIndex(w => w.id === windowId);
            if (windowIndex !== -1) {
                newWindows[windowIndex] = {
                    ...newWindows[windowIndex],
                    isMinimized: false,
                    isFocused: true,
                    zIndex: nextZIndex
                };
            }
            setNextZIndex(nextZIndex + 1);
            return newWindows;
        });
    };

    const toggleMinimize = (windowId: string) => {
        setWindows(current =>
            current.map(w =>
                w.id === windowId
                    ? {...w, isMinimized: !w.isMinimized}
                    : w
            )
        );
    };

    return (
        <div style={{height: '100vh', display: 'flex', flexDirection: 'column'}}>
            {/* Windows Area */}
            <div style={{flex: 1, position: 'relative', overflow: 'hidden', backgroundColor: '#008080'}}>
                {windows.map(window => (
                    !window.isMinimized && (<>
                        <Window key={window.id}
                                title={window.title}
                                sx={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    zIndex: window.zIndex,
                                    margin: 0
                                }}
                                focus={window.isFocused}
                                onClick={() => bringToFront(window.id)}
                                minimizeCallback={() => {
                                    toggleMinimize(window.id);
                                }}>

                            {window.component}
                        </Window>
                    </>)
                ))}
            </div>

            {/* Taskbar */}
            <div className="window" style={{
                margin: 0,
                borderRadius: 0,
                display: 'flex',
                padding: '2px',
                gap: '2px'
            }}>
                <button
                    className="start-button"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 6px',
                        fontWeight: 'bold'
                    }}
                >
                    <img
                        src="/windows-logo.png"
                        alt="Start"
                        style={{width: '16px', height: '16px', marginTop: '0', border: 'none'}}
                    />
                    Start
                </button>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    gap: '2px',
                    padding: '0 4px'
                }}>
                    {windows.map(window => (
                        <button
                            key={window.id}
                            className={`task-button ${!window.isMinimized ? 'active' : ''}`}
                            onClick={() => {
                                if (window.isFocused && !window.isMinimized) {
                                    toggleMinimize(window.id);
                                } else {
                                    bringToFront(window.id);
                                }
                            }}
                            style={{
                                flex: 1,
                                maxWidth: '200px',
                                textAlign: 'left',
                                padding: '2px 8px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '4px'
                            }}
                        >
                            <img
                                src={`/${window.id}-icon.png`}
                                alt=""
                                style={{width: '16px', height: '16px', marginTop: '0', border: 'none'}}
                            />
                            {window.title}
                        </button>
                    ))}
                </div>
                <div className="system-tray" style={{
                    borderLeft: '1px solid #808080',
                    padding: '0 4px',
                    display: 'flex',
                    alignItems: 'center'
                }}>
          <span style={{fontSize: '12px'}}>
            {clock}
          </span>
                </div>
            </div>
        </div>
    );
}

export default WindowManager;