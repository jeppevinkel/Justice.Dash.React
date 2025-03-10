import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Window from '../Window';
import win7bg from '../images/win7bg.jpg';
import { MenuItem } from '../apiClient/apiClient';
import { filterMenu } from '../MenuItem';
import Markdown from 'react-markdown'

function RecipeModal() {
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentMenu = async () => {
            try {
                const response = await fetch('/api/menu');
                const data = await response.json();
                // Apply the same time-based filtering that the dashboard uses
                const filteredData = filterMenu(data);
                if (filteredData && filteredData.length > 0) {
                    // Explicitly cast the menu item to ensure type compatibility
                    setMenuItem(filteredData[0] as MenuItem);
                }
            } catch (error) {
                console.error('Failed to load menu item:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentMenu();
    }, []);

    return (
        <div style={{position: 'absolute', top: 0, left: 0, bottom: 0, right: 0, backgroundImage: `url(${win7bg})`, backgroundSize: 'cover'}}>
            <Window 
                title={'Opskrift - ' + (menuItem?.foodDisplayName || 'Indlæser...')} 
                maximized={true} 
                fullscreen={true} 
                sx={{
                    margin: '24px',
                    height: 'calc(100vh - 48px)',
                    top: 0,
                    position: 'absolute',
                    width: 'calc(100vw - 48px)'
                }} 
                maximizeCallback={() => navigate(-1)}
            >
                {loading ? (
                    <Typography variant="body1" sx={{ padding: 2 }}>Indlæser opskrift...</Typography>
                ) : menuItem ? (
                    <>
                        {menuItem.recipe ? (
                            <Box sx={{ padding: 2, overflowY: 'auto', maxHeight: 'calc(100vh - 120px)' }}>
                                <Markdown>{menuItem.recipe}</Markdown>
                            </Box>
                        ) : menuItem.needsRecipeGeneration ? (
                            <Typography variant="body1" sx={{ padding: 2 }}>
                                Opskrift er under udarbejdelse...
                            </Typography>
                        ) : (
                            <Typography variant="body1" sx={{ padding: 2 }}>
                                Ingen opskrift tilgængelig for denne ret.
                            </Typography>
                        )}
                    </>
                ) : (
                    <Typography variant="body1" sx={{ padding: 2 }}>Ingen menu fundet.</Typography>
                )}
            </Window>
        </div>
    );
}

export default RecipeModal;