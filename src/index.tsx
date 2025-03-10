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
import ConstructionImage from './routes/ConstructionImage';
import ConstructionImageBefore from './routes/ConstructionImageBefore';
import MenuEditor from './routes/editor/MenuEditor';
import WindowManager from './routes/editor/WindowManager';
import ProgressAdoEditor from './routes/editor/ProgressAdoEditor';
import RecipeView from './routes/RecipeView';
import RecipeModal from './routes/RecipeModal';

const router = createBrowserRouter([
    {
        element: <Root />,
        children: [
            {
                path: '/:teamName?',
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
            },
            {
                path: 'construction-image-before',
                element: <ConstructionImageBefore />
            },
            {
                path: 'construction-image-after',
                element: <ConstructionImage />
            },
            {
                path: 'recipe-view',
                element: <RecipeView />
            },
            {
                path: 'recipe-modal',
                element: <RecipeModal />
            },
            {
                path: 'edit',
                element: <WindowManager />
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
