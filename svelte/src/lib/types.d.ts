export interface IngredientBrowse {
    id: number;
    slug?: string;
    cas: string;
    commonName: string;
    descriptors: string;
    ingredientType?: string;
    isRestricted?: boolean;
    origin?: string;
    otherNames: string;
    use: string;
    similarIngredients: IngredientBrowse[];
    volatility: string;
    relatedIngredients: {
        commonName: string;
        slug: string;
    };
    contributors: User[];
}

export interface User {
    is_authenticated: boolean;
    username: string;
    email: string;
    csrfToken: string;
}


export interface ResponseBrowse {
    page: number;
    count: number;
    search: string;
    total_pages: number;
    names: IngredientBrowse[];
    cas: IngredientBrowse[];
    descriptors: IngredientBrowse[];
}

export interface Descriptor {
    id: number;
    name: string;
    description: string;
}

export interface IngredientCollection {
    id: number;
    commonName: string;
    cas: string;
    origin: string;
    otherNames: string;
    markdown: string;
    amount: number;
    unit: string;
    related_formulas: Formula[];
}

export interface Formula {
    id: string;
    name: string;
    created?: string;
    updated?: string;
    notes: string;
    description: string;
    solvent: string;
    ingredients: FormulaIngredient[];
}

export interface FormulaIngredient {
    id: string;
    amount: number;
    common_name: string;
    formula_id: number;
    percentage: number;
    volatility: string;
    unit: string;
    counterpart?: IngredientCollection;
}

export interface Toast {
    message: string | null;
    type: 'success' | 'error' | 'info' | null;
}