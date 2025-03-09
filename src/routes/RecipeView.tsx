import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, List, ListItem } from '@mui/material';
import Window from '../Window';
import win7bg from '../images/win7bg.jpg';
import { MenuItem } from '../apiClient/apiClient';

// Simple Markdown renderer component
const MarkdownRenderer = ({ markdown }: { markdown: string }) => {
    if (!markdown) return null;

    // Process the markdown to convert to React elements
    const processMarkdown = (text: string) => {
        // Replace headers
        text = text.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        text = text.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        text = text.replace(/^# (.*$)/gm, '<h1>$1</h1>');

        // Replace bold
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Replace italic
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Replace lists
        text = text.replace(/^\s*\*\s(.*)$/gm, '<li>$1</li>');
        
        // Replace line breaks
        text = text.replace(/\n/g, '<br />');
        
        // Wrap list items in ul
        text = text.replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>');
        
        // Remove duplicate ul tags
        text = text.replace(/<\/ul><ul>/g, '');
        
        return text;
    };

    const processedHtml = processMarkdown(markdown);
    
    return <div dangerouslySetInnerHTML={{ __html: processedHtml }} />;
};

function RecipeView() {
    const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCurrentMenu = async () => {
            try {
                const response = await fetch('/api/menu');
                const data = await response.json();
                if (data && data.length > 0) {
                    setMenuItem(data[0]);
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
                                <Typography variant="h5" gutterBottom>{menuItem.foodDisplayName}</Typography>
                                <MarkdownRenderer markdown={menuItem.recipe} />
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