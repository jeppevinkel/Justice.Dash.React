import React, {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import MenuEditor from './MenuEditor';
import ModifierEditor from './ModifierEditor';
import ProgressAdoEditor from './ProgressAdoEditor';
import Window from '../../Window';
import { ProgressType } from '../../apiClient/apiClient';

interface WindowDefinition {
    id: string;
    title: string;
    component: React.ReactNode;
    isMinimized: boolean;
    isFocused: boolean;
    zIndex: number;
}

function WindowManager() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Helper function to parse URL state
    const getInitialWindowStates = () => {
        const openWindows = searchParams.get('open')?.split(',') || ['menu-editor'];
        return [openWindows];
    };

    const [openWindows] = getInitialWindowStates();

    const [windows, setWindows] = useState<WindowDefinition[]>([
        {
            id: 'menu-editor',
            title: 'Menu Editor',
            component: <MenuEditor/>,
            isMinimized: !openWindows.includes('menu-editor'),
            isFocused: openWindows[openWindows.length - 1] === 'menu-editor',
            zIndex: openWindows.indexOf('menu-editor') + 1,
        },
        {
            id: 'modifier-editor',
            title: 'Food Modifier Editor',
            component: <ModifierEditor/>,
            isMinimized: !openWindows.includes('modifier-editor'),
            isFocused: openWindows[openWindows.length - 1] === 'modifier-editor',
            zIndex: openWindows.indexOf('modifier-editor') + 1,
        },

        {
            id: 'progress-editor-gh',
            title: 'GitHub Progress Editor',
            component: <ProgressAdoEditor progressType={ProgressType.github}/>,
            isMinimized: !openWindows.includes('progress-editor-gh'),
            isFocused: openWindows[openWindows.length - 1] === 'progress-editor-gh',
            zIndex: openWindows.indexOf('progress-editor-gh') + 1,
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

    // Helper function to update URL params
    const updateUrlParams = (windows: WindowDefinition[]) => {
        const openWindows = windows
            .filter(w => !w.isMinimized)
            .sort((a, b) => a.zIndex - b.zIndex)
            .map(w => w.id);

        setSearchParams({
            open: openWindows.join(','),
        });
    };

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

        // Update URL after state changes
        setWindows(current => {
            updateUrlParams(current);
            return current;
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

        // Update URL after state changes
        setWindows(current => {
            updateUrlParams(current);
            return current;
        });
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