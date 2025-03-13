import React, {useEffect, useState} from 'react';
import {Divider, ListItem, ListItemText, Typography} from '@mui/material';
import Icon from './Icon';
import { useNavigate } from 'react-router-dom';
import AnimatedImage from './AnimatedImage';

export function getMenuList(menus: {
    date: string,
    day: string,
    foodName: string,
    correctedFoodName?: string,
    description?: string,
    recipe?: string,
    foodContents: string[],
    weekNumber: number,
    image?: { path: string, prompt: string, revisedPrompt: string }
}[], max: number | undefined = undefined, veganize: boolean = false) {
    const menuSlice = max === undefined ? menus : menus.slice(0, max);

    return menuSlice.map((menu: any, idx: number) => (
        <MenuItem menu={menu} addDivider={idx < menuSlice.length - 1}
                  highlight={idx === 0} veganize={veganize} key={idx}/>
    ));
}

export function filterMenu(menus: {
    date: string,
    day: string,
    foodName: string,
    correctedFoodName?: string,
    description?: string,
    recipe?: string,
    foodContents: string[],
    weekNumber: number,
    image?: { path: string, prompt: string, revisedPrompt: string }
}[]) {
    const now = new Date();
    const dateNow = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (now.getHours() >= 13) dateNow.setDate(dateNow.getDate() + 1); // if after 13:00, set to next day

    return menus.filter((menu) => {
        const itemDate = new Date(menu.date);
        return itemDate >= dateNow;
    });
}

function MenuItem({menu, addDivider, highlight, veganize}: {
    menu: {
        date: string,
        day: string,
        foodName: string,
        correctedFoodName?: string,
        veganizedFoodName?: string,
        description?: string,
        veganizedDescription?: string,
        recipe?: string,
        foodContents: string[],
        weekNumber: number,
        image?: { path: string, prompt: string, revisedPrompt: string },
        veganizedImage?: { path: string, prompt: string, revisedPrompt: string },
        needsRecipeGeneration?: boolean
    },
    addDivider: boolean,
    highlight: boolean,
    veganize?: boolean
}) {
    const date = new Date(menu.date);
    const [filteredFoodContents, setFilteredFoodContents] = useState<string[]>([]);
    const navigate = useNavigate();
    
    const handleClick = () => {
        const formattedDate = date.toISOString().split('T')[0];
        navigate(`/recipe-modal/${formattedDate}`);
    };

    useEffect(() => {
        let showMeat = true;
        for (const foodContent of menu.foodContents) {
            if (['fjerkræ', 'kylling', 'svinekød', 'fisk'].includes(foodContent)) {
                showMeat = false;
            }
        }

        if (veganize) {
            setFilteredFoodContents(['vegansk']);
        } else if (showMeat) {
            setFilteredFoodContents(menu.foodContents);
        } else {
            setFilteredFoodContents(menu.foodContents.filter(it => it !== 'kød'));
        }
    }, [menu, veganize]);

    return (
        <React.Fragment>
            <ListItem 
                alignItems="flex-start" 
                sx={{
                    backgroundColor: highlight ? 'rgba(248, 233, 159, 0.5)' : undefined,
                    cursor: menu.recipe || !menu.needsRecipeGeneration ? 'pointer' : 'default',
                    '&:hover': {
                        backgroundColor: menu.recipe || !menu.needsRecipeGeneration 
                            ? highlight ? 'rgba(248, 233, 159, 0.8)' : 'rgba(0, 0, 0, 0.04)' 
                            : undefined
                    }
                }}
                onClick={menu.recipe || !menu.needsRecipeGeneration ? handleClick : undefined}
            >
                <ListItemText primary={
                    <Typography variant={'h5'} fontWeight={600}>
                        {veganize ? menu.veganizedFoodName ?? menu.correctedFoodName ?? menu.foodName.trim() : menu.correctedFoodName !== null ? menu.correctedFoodName : menu.foodName.trim()}
                    </Typography>}
                              secondary={
                                  <React.Fragment>
                                      <Typography
                                          sx={{display: 'inline'}}
                                          component="span"
                                          variant="body1"
                                          color="text.primary"
                                      >
                                          {menu.day}
                                      </Typography>
                                      {` - ${date.getDate()}/${date.getMonth() + 1}`}
                                      {(veganize && menu.veganizedDescription !== null && highlight && (
                                          <Typography
                                              component="p"
                                              variant="body1"
                                              color="text.secondary">
                                              {menu.veganizedDescription}
                                          </Typography>)) || (menu.description !== null && highlight && (
                                          <Typography
                                              component="p"
                                              variant="body1"
                                              color="text.secondary">
                                              {menu.description}
                                          </Typography>))}
                                  </React.Fragment>
                              }/>

                {filteredFoodContents.map((it, idx) => {
                    return (
                        <Icon type={it} key={idx}/>
                    );
                })}

            </ListItem>
            {addDivider && <Divider variant="fullWidth" component="li"/>}
        </React.Fragment>
    );
}

export default MenuItem;