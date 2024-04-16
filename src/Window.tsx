import React, {CSSProperties, ReactNode} from 'react';

interface Props {
    title?: string,
    children: ReactNode,
    sx?: CSSProperties,
    glass?: boolean,
    maximized?: boolean,
    fullscreen?: boolean,
}

function Window({title, children, sx, glass = true, maximized, fullscreen}: Props) {

    return (
        <div className={`window ${glass ? 'glass' : ''} ${fullscreen ? 'window-full-screen' : ''} active`} style={sx}>
            <div className="title-bar">
                <div className="title-bar-text">{title}</div>
                <div className="title-bar-controls">
                    <button aria-label="Minimize"></button>
                    <button aria-label={maximized ? 'Restore' : 'Maximize'}></button>
                    <button aria-label="Close"></button>
                </div>
            </div>
            <div className="window-body has-space has-scrollbar" style={{flex: fullscreen ? '1 1 auto' : ''}}>
                {children}
            </div>
        </div>
    );
}

export default Window;