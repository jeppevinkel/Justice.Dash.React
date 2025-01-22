export interface MenuItem {
    id: string;
    date: string;
    day: string;
    weekNumber: number;
    foodName: string;
    correctedFoodName: string | null;
    veganizedFoodName: string | null;
    description: string | null;
    veganizedDescription: string | null;
    foodContents: string[];
    foodModifier: string | null;
    image: Image | null;
    veganizedImage: Image | null;
    foodDisplayName: string;
}

export interface Image {
    path: string;
    prompt: string;
    revisedPrompt: string
}

export interface MenuItemUpdate {
    foodName?: string;
    correctedFoodName?: string;
    veganizedFoodName?: string;
    description?: string;
    veganizedDescription?: string;
    foodModifier?: string;
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

    async updateMenuItem(id: string, update: MenuItemUpdate): Promise<MenuItem> {
        const response = await fetch(`${this.baseUrl}/menu/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(update),
        });
        return response.json();
    }

    async getFoodModifiers(): Promise<string[]> {
        const response = await fetch(`${this.baseUrl}/menu/modifiers`);
        return response.json();
    }
}