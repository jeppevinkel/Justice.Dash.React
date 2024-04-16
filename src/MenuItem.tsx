import React, {useEffect, useState} from 'react';
import {Divider, ListItem, ListItemText, Typography} from '@mui/material';
import Icon from './Icon';

export function getMenuList(menus: {
    date: string,
    day: string,
    foodName: string,
    correctedFoodName?: string,
    foodDescription?: string,
    foodContents: string[],
    weekNumber: number,
    image?: { path: string, prompt: string, revisedPrompt: string }
}[], max: number | undefined = undefined) {
    const menuSlice = max === undefined ? menus : menus.slice(0, max);

    return menuSlice.map((menu: any, idx: number) => (
        <MenuItem menu={menu} addDivider={idx < menuSlice.length - 1}
                  highlight={idx === 0} key={idx}/>
    ));
}

export function filterMenu(menus: {
    date: string,
    day: string,
    foodName: string,
    correctedFoodName?: string,
    foodDescription?: string,
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

function MenuItem({menu, addDivider, highlight}: {
    menu: {
        date: string,
        day: string,
        foodName: string,
        correctedFoodName?: string,
        foodDescription?: string,
        foodContents: string[],
        weekNumber: number,
        image?: { path: string, prompt: string, revisedPrompt: string }
    },
    addDivider: boolean,
    highlight: boolean
}) {
    const date = new Date(menu.date);
    const [filteredFoodContents, setFilteredFoodContents] = useState<string[]>([]);

    useEffect(() => {
        let showMeat = true;
        for (const foodContent of menu.foodContents) {
            if (['fjerkræ', 'kylling', 'svinekød', 'fisk'].includes(foodContent)) {
                showMeat = false;
            }
        }

        if (showMeat) {
            setFilteredFoodContents(menu.foodContents);
        } else {
            setFilteredFoodContents(menu.foodContents.filter(it => it !== 'kød'));
        }
    }, [menu]);

    return (
        <React.Fragment>
            <ListItem alignItems="flex-start" sx={{
                backgroundColor: highlight ? 'rgba(248, 233, 159, 0.5)' : undefined
            }}>
                <ListItemText primary={
                    <Typography variant={'h5'} fontWeight={600}>
                        {menu.correctedFoodName !== null ? menu.correctedFoodName : menu.foodName.trim()}
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
                                      {menu.foodDescription !== null && highlight && (
                                          <Typography
                                              component="p"
                                              variant="body1"
                                              color="text.secondary">
                                              {menu.foodDescription}
                                          </Typography>)}
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