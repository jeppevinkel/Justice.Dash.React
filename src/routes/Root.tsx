import {Outlet, useNavigation} from 'react-router-dom';

function Root() {
    const navigation = useNavigation();


    return (
        <>
            {navigation.state !== 'loading' && <Outlet/>}
            {navigation.state === 'loading' && <>

            </>}
        </>
    );
}

export default Root;