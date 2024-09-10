// app.d.ts

declare global {
  namespace App {
    // Declare your interfaces inside the App namespace
    interface IngredientBrowse {
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
      volatility: string;
      similar_ingredients: IngredientBrowse[];
      contributors: User[];
    }

    interface ResponseBrowse {
      page: number;
      total_pages: number;
      results: IngredientBrowse[];
    }

    interface Descriptor {
      id: number;
      name: string;
    }

    interface IngredientCollection {
      id: number;
      uuid: string;
      amount: number;
      cas: string;
      colour?: string;
      common_name: string;
      date_added: string;
      impression?: string;
      ideas?: string;
      is_collection: boolean;
      type: string;
      unit: string;
      use: string;
      volatility: string;
      associations: string;
    }

    interface Formula {
      id: number;
      uuid: string;
      name: string;
      created: string;
      updated: string;
      created_at: string;
      notes: string;
      description: string;
      solvent: string;
      ingredients: FormulaIngredient[];
    }

    interface FormulaIngredient {
      id: number;
      amount: number;
      collection_ingredient_id?: number;
      custom_collection_ingredient_id?: number;
      formula_id: number;
      percentage: number;
    }

    interface User {
      is_authenticated: boolean;
      username: string;
      email: string;
      csrfToken: string;
    }
  }
}

export {};
