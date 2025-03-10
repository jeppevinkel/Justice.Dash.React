import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography } from '@mui/material';
import Window from '../Window';
import win7bg from '../images/win7bg.jpg';
import { MenuItem } from '../apiClient/apiClient';
import { filterMenu } from '../MenuItem';
import Markdown from 'react-markdown'

function RecipeView() {
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
                    setMenuItem(filteredData[0]);
                }
            } catch (error) {
                console.error('Failed to load menu item:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentMenu();
    }, []);

    const handleBack = () => {
        navigate('/');
    };

    return (
        <div className="App" style={{
            backgroundImage: `url(${win7bg})`,
            backgroundSize: 'cover',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <Window title={'Opskrift - ' + (menuItem?.foodDisplayName || 'Indlæser...')}>
                {loading ? (
                    <Typography variant="body1">Indlæser opskrift...</Typography>
                ) : menuItem ? (
                    <>
                        {menuItem.recipe ? (
                            <Box sx={{ padding: 2 }}>
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
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
                            <Button 
                                variant="contained" 
                                onClick={handleBack}
                                style={{ 
                                    backgroundColor: '#d3d3d3',
                                    color: 'black',
                                    border: '1px solid #888888',
                                    boxShadow: 'inset -1px -1px #0a0a0a,inset 1px 1px #ffffff,inset -2px -2px #808080,inset 2px 2px #dfdfdf'
                                }}
                            >
                                Tilbage til Dashboard
                            </Button>
                        </Box>
                    </>
                ) : (
                    <Typography variant="body1">Ingen menu fundet.</Typography>
                )}
            </Window>
        </div>
    );
}

export default RecipeView;