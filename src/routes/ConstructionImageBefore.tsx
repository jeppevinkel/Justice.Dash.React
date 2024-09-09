import React from 'react';
import Window from '../Window';
import win7bg from '../images/win7bg.jpg';
import { useNavigate } from 'react-router-dom';

function ConstructionImageBefore() {
    const navigate = useNavigate();

    return (
        <div style={{position: 'absolute', top: 0, left: 0, right: 0, backgroundImage: `url(${win7bg})`}}>
            <Window title={'Madbillede'} maximized={true} fullscreen={false} sx={{
                margin: '24px'
            }} maximizeCallback={() => navigate('/')}>
                <img width={'100%'} src={'/oldapi/images/domicil/secondlatest'}  alt={'The latest update from the construction site.'}/>
            </Window>
        </div>
    );
}

export default ConstructionImageBefore;