import Service from "./Service";

class IngredientService extends Service {
    appName = 'dashboard';
    view = 'ingredient';
}

export default new IngredientService()