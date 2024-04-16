import React from 'react';

function Image({path}: {path: string}) {

    return (
        <img src={path}  alt={path}/>
    )
}

export default Image;