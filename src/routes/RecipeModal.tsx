import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import Window from '../Window';
import win7bg from '../images/win7bg.jpg';
import { MenuItem } from '../apiClient/apiClient';
// Ensure MenuItem type includes image property if not already defined in apiClient
import { filterMenu } from '../MenuItem';
import Markdown from 'react-markdown'

function RecipeModal() {
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { date } = useParams<{ date?: string }>();

    useEffect(() => {
        const fetchMenuData = async () => {
            try {
                const response = await fetch('/api/menu');
                const data = await response.json();
                
                let selectedItem: MenuItem | null = null;
                
                // If a specific date was provided, find that menu item
                if (date) {
                    selectedItem = data.find((item: any) => 
                        new Date(item.date).toISOString().split('T')[0] === date
                    ) as MenuItem || null;
                } 
                
                // If no date provided or no item found with that date, show today's menu
                if (!selectedItem) {
                    const filteredData = filterMenu(data);
                    if (filteredData && filteredData.length > 0) {
                        selectedItem = filteredData[0] as MenuItem;
                    }
                }
                
                setMenuItem(selectedItem);
            } catch (error) {
                console.error('Failed to load menu item:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenuData();
    }, [date]);

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
                        {menuItem.image && (
                            <Box sx={{ padding: 2, display: 'flex', justifyContent: 'center' }}>
                                <img 
                                    src={menuItem.image.path} 
                                    alt={`Billede af ${menuItem.foodDisplayName || menuItem.foodName}`}
                                    style={{ maxWidth: '100%', maxHeight: '300px', objectFit: 'contain' }}
                                />
                            </Box>
                        )}
                        {menuItem.recipe ? (
                            <Box sx={{ padding: 2, overflowY: 'auto', maxHeight: menuItem.image ? 'calc(100vh - 450px)' : 'calc(100vh - 120px)' }}>
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