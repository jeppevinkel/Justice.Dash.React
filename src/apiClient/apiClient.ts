export interface MenuItem {
    date: string;
    day: string;
    weekNumber: number;
    foodName: string;
    correctedFoodName: string | null;
    veganizedFoodName: string | null;
    description: string | null;
    veganizedDescription: string | null;
    foodContents: string[];
    foodModifier: FoodModifier | null;
    image: Image | null;
    veganizedImage: Image | null;
    foodDisplayName: string;

    needsNameCorrection: boolean;
    needsVeganization: boolean;
    needsDescription: boolean;
    needsVeganDescription: boolean;
    needsFoodContents: boolean;
    needsImageRegeneration: boolean;
    needsVeganImageRegeneration: boolean;
}

export interface Image {
    path: string;
    prompt: string;
    revisedPrompt: string
}

export interface FoodModifier {
    id: string
    title: string;
    description: string;
}

export interface MenuItemUpdate {
    foodName?: string;
    correctedFoodName?: string;
    veganizedFoodName?: string;
    description?: string;
    veganizedDescription?: string;
    foodModifierId?: string;
    regenerateImages?: boolean;
    regenerateDescriptions?: boolean;
    regenerateNames?: boolean;
    regenerateFoodContents?: boolean;
}

export class MenuApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    async getMenuItems(full: boolean = false): Promise<MenuItem[]> {
        const response = await fetch(`${this.baseUrl}/menu?full=${full}`);
        return response.json();
    }

    async updateMenuItem(date: string, update: MenuItemUpdate): Promise<MenuItem> {
        const response = await fetch(`${this.baseUrl}/menu/${date}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(update),
        });
        return response.json();
    }

    async getFoodModifiers(): Promise<FoodModifier[]> {
        const response = await fetch(`${this.baseUrl}/FoodModifier`);
        return response.json();
    }
}