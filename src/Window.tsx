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
    onClick?: React.MouseEventHandler<HTMLDivElement>,
    focus?: boolean
}

function Window({title, children, sx, glass = true, maximized, fullscreen, minimizeCallback, maximizeCallback, closeCallback, onClick, focus = true}: Props) {

    return (
        <div className={`window ${glass ? 'glass' : ''} ${fullscreen ? 'window-full-screen' : ''} ${focus ? 'active' : ''}`} style={sx} onClick={onClick}>
            <div className="title-bar">
                <div className="title-bar-text">{title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize" onClick={() => {if (minimizeCallback) minimizeCallback()}}></button>
                    <button aria-label={maximized ? 'Restore' : 'Maximize'} onClick={() => {if (maximizeCallback) maximizeCallback()}}></button>
                    <button aria-label="Close" onClick={() => {if (closeCallback) closeCallback()}}></button>
                </div>
            </div>
            <div className="window-body has-space has-scrollbar" style={{
                flex: fullscreen ? '1 1 auto' : '', 
                maxHeight: fullscreen ? '100%' : 'calc(100vh - 100px)',
                overflow: 'auto'
            }}>
                {children}
            </div>
        </div>
    );
}

export default Window;