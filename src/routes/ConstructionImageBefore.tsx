import React, {useEffect, useState} from 'react';
import Window from '../Window';
import win7bg from '../images/win7bg.jpg';
import {useNavigate} from 'react-router-dom';
import {filterMenu} from '../MenuItem';

function ConstructionImageBefore() {
    const navigate = useNavigate();
    const [image, setImage] = useState<{
        path: string,
        imageUpdateDate: number,
        albumAddDate: number,
        width: number,
        height: number,
        uid: string
    } | null>(null);

    useEffect(() => {
        fetch('/api/domicile')
            .then((res) => res.json())
            .then((data) => data.length > 1 ? setImage(data[1]) : setImage(null))
            .catch(err => console.error(err));
    }, []);

    return (
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundImage: `url(${win7bg})`}}>
            <Window title={'Madbillede'} maximized={true} fullscreen={false} sx={{
                margin: '24px'
            }} maximizeCallback={() => navigate('/')}>
                <img width={'100%'} src={image?.path}
                     alt={'The latest update from the construction site.'}/>
            </Window>
        </div>
    );
}

export default ConstructionImageBefore;