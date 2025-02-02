export interface IngredientBrowse {
    id: number;
    slug?: string;
    cas: string;
    common_name: string;
    descriptors: string;
    ingredient_type?: string;
    is_restricted?: boolean;
    origin?: string;
    other_names: string;
    use: string;
    similar_ingredients: IngredientBrowse[];
    volatility: string;
    related_ingredients: {
        common_name: string;
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
    amount: number;
    cas: string;
    descriptors: string;
    origin: string;
    other_names: string;
    colour?: string;
    common_name: string;
    date_added: string;
    impression?: string;
    ideas?: string;
    is_collection: boolean;
    is_restricted: boolean;
    type: string;
    unit: string;
    use: string;
    volatility: string;
    associations: string;
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