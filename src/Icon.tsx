import vegan from './icons/vegan.png';
import bacon from './icons/bacon.png';
import incomplete from './icons/incomplete.png';
import lactoseFree from './icons/lactose-free.png';
import chickenLeg from './icons/chicken-leg.png';
import fish from './icons/fish.png';
import meat from './icons/meat.png';
import {useEffect, useState} from 'react';

/// Icons found from https://www.flaticon.com/search?type=icon&search-group=all&word=fish&license=&color=&shape=&current_section=&author_id=&pack_id=&family_id=&style_id=&type=

function Icon({type}: { type: string }) {
    const [iconSrc, setIconSrc] = useState('');

    useEffect(() => {
        switch (type) {
            case 'vegansk':
                setIconSrc(vegan);
                break;
            case 'svinekød':
                setIconSrc(bacon);
                break;
            case 'laktosefri':
                setIconSrc(lactoseFree);
                break;
            case 'kylling':
            case 'fjerkræ':
                setIconSrc(chickenLeg);
                break;
            case 'fisk':
                setIconSrc(fish);
                break;
            case 'kød':
                setIconSrc(meat);
                break;
            default:
                setIconSrc(incomplete);
                break;
        }
    }, [type]);

    return (
        <img width={32} src={iconSrc} alt={type}/>
    );
}

export default Icon;