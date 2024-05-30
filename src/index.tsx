import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Dashboard from './routes/Dashboard';
import reportWebVitals from './reportWebVitals';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import Surveillance from './routes/config/Surveillance';
import Root from './routes/Root';
import Config from './routes/config/Config';
import Menu from './routes/Menu';
import MenuImage from './routes/MenuImage';

const router = createBrowserRouter([
    {
        element: <Root />,
        children: [
            {
                path: '/',
                index: true,
                element: <Dashboard/>,
            },
            {
                path: 'config',
                element: <Config/>,
                children: [
                    {
                        path: 'surveillance',
                        element: <Surveillance />,
                    }
                ]
            },
            {
                path: 'menu',
                element: <Menu />
            },
            {
                path: 'menu-image',
                element: <MenuImage />
            }
        ]
    }

]);

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
