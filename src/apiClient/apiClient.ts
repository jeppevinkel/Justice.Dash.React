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
    recipe: string | null;
    needsRecipeGeneration: boolean;

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
    id?: string
    title: string;
    description: string;
}

export interface MenuItemUpdate {
    foodName?: string;
    correctedFoodName?: string;
    veganizedFoodName?: string;
    description?: string;
    veganizedDescription?: string;
    recipe?: string;
    foodModifierId?: string;
    regenerateImages?: boolean;
    regenerateDescriptions?: boolean;
    regenerateNames?: boolean;
    regenerateFoodContents?: boolean;
    regenerateRecipe?: boolean;
}

export interface FoodModifierUpdate {
    title: string;
    description: string;
}

export interface ProgressStatus {
    id: string;
    completedItems: number;
    totalItems: number;
    percentageCompletion: number;
}

export enum ProgressType {
    azureDevOps = 'ProgressAdo',
    github = 'ProgressGh'
}

export interface ProgressUpdate {
    completedItems: number;
    totalItems: number;
}

export interface WeatherData {
    isRaining: boolean;
    rainAmount: number;
    temperature: number;
    humidity: number;
    lastUpdate: string;
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

    async getWeather(): Promise<WeatherData> {
        const response = await fetch(`${this.baseUrl}/Weather`);
        return response.json();
    }

    async updateFoodModifier(id: string, update: FoodModifierUpdate): Promise<FoodModifier> {
        const response = await fetch(`${this.baseUrl}/FoodModifier/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(update),
        });
        return response.json();
    }

    async addFoodModifier(foodModifier: FoodModifier): Promise<void> {
        const response = await fetch(`${this.baseUrl}/FoodModifier`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(foodModifier),
        });
        return response.json();
    }

    async deleteFoodModifier(id: string): Promise<void> {
        await fetch(`${this.baseUrl}/FoodModifier/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    async getProgressStatus(progressType: ProgressType): Promise<ProgressStatus | null> {
        const response = await fetch(`${this.baseUrl}/${progressType}`);
        if (response.status === 404) {
            return null;
        }
        return response.json();
    }

    async updateProgressStatus(update: ProgressUpdate, progressType: ProgressType): Promise<ProgressStatus> {
        const response = await fetch(`${this.baseUrl}/${progressType}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(update),
        });
        return response.json();
    }
}