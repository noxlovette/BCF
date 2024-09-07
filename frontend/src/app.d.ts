// app.d.ts

declare global {
  namespace App {
    // Declare your interfaces inside the App namespace
    interface IngredientBrowse {
      id: number;
      cas: string;
      common_name: string;
      descriptors: string;
      ingredient_type?: string;
      is_restricted?: boolean;
      origin?: string;
      other_names: string;
      use: string;
      volatility: string;
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
    }
  }
}

export {};
