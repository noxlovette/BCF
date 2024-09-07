// app.d.ts

declare global {
  namespace App {
    // Declare your interfaces inside the App namespace
    interface IngredientBrowse {
      cas: string;
      common_name: string;
      descriptors: string;
      id: number;
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
  }
}

export {};
