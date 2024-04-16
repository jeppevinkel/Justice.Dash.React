import {Outlet} from 'react-router-dom';
import Window from '../../Window';
import win7bg from '../../images/win7bg.jpg';

function Config() {

    return (
        <div style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundImage: `url(${win7bg})`}}>
            <Window title={'Config'} maximized={true} fullscreen={true} sx={{
                margin: '24px',
                height: 'calc(100vh - 48px)',
                top: 0,
                position: 'absolute',
                width: 'calc(100vw - 48px)'
            }}>
                <section className="tabs" style={{height: '100%', display: 'flex', flexFlow: 'column'}}>
                    <menu role="tablist" aria-label="Tabs Template">
                        <button role="tab" aria-controls="tab-surveillance" aria-selected="true">Surveillance</button>
                        <button role="tab" aria-controls="tab-B">Tab B</button>
                        <button role="tab" aria-controls="tab-C">Tab C</button>
                        <button role="tab" aria-controls="tab-D" disabled>Tab D</button>
                    </menu>
                    <article role="tabpanel" id="tab-surveillance" style={{flex: '1 1 auto'}}><Outlet/></article>
                    <article role="tabpanel" id="tab-B" hidden>Tab B is active</article>
                    <article role="tabpanel" id="tab-C" hidden>Tab C is active</article>
                    <article role="tabpanel" id="tab-D" hidden>Tab D is inactive</article>
                </section>
            </Window>
        </div>
    );
}

export default Config;