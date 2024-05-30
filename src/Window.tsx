import React, {CSSProperties, ReactNode} from 'react';

interface Props {
    title?: string,
    children: ReactNode,
    sx?: CSSProperties,
    glass?: boolean,
    maximized?: boolean,
    fullscreen?: boolean,
    maximizeCallback?: () => void,
    minimizeCallback?: () => void,
    closeCallback?: () => void,
}

function Window({title, children, sx, glass = true, maximized, fullscreen, minimizeCallback, maximizeCallback, closeCallback}: Props) {

    return (
        <div className={`window ${glass ? 'glass' : ''} ${fullscreen ? 'window-full-screen' : ''} active`} style={sx}>
            <div className="title-bar">
                <div className="title-bar-text">{title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" onClick={() => {if (minimizeCallback) minimizeCallback()}}></button>
                    <button aria-label={maximized ? 'Restore' : 'Maximize'} onClick={() => {if (maximizeCallback) maximizeCallback()}}></button>
                    <button aria-label="Close" onClick={() => {if (closeCallback) closeCallback()}}></button>
                </div>
            </div>
            <div className="window-body has-space has-scrollbar" style={{flex: fullscreen ? '1 1 auto' : ''}}>
                {children}
            </div>
        </div>
    );
}

export default Window;