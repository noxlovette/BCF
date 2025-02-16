export interface IngredientBrowse {
  id: number;
  slug?: string;
  cas: string;
  commonName: string;
  ingredientType?: string;
  isRestricted?: boolean;
  origin?: string;
  otherNames: string;
  ingDescription: string;
  similarIngredients: IngredientBrowse[];
  volatility: string;
  descriptors: string[];
  colours: string[];
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
  otherNames: string;
  markdown: string;
  amount: number;
  unit: string;
  relatedFormulas: Formula[];
}

export interface Formula {
  id: string;
  title: string;
  description: string;
  solvent: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormulaIngredient {
  name: string;
  formulaId: string;
  amount: number;
  percentage: number;
  counterpartId?: string;
  volatility: string;
  unit: string;
  id?: string;
  counterpart?: string;
}

export interface BrowseComposite {
  ingredient: IngredientBrowse;
  suggestions: Suggestion[];
}

export interface Suggestion {
  id: string;
  ingredientId: string;
  commonName: string;
  cas?: string;
  markdown: string;
  user_id: string;
  status: "pending" | "approved" | "rejected";
}

export interface FormulaComposite {
  formula: Formula;
  ingredients: FormulaIngredient[];
}

export interface Toast {
  message: string | null;
  type: "success" | "error" | "info" | null;
}
