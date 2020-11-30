import Service from './Service';

class MenuCategoryService extends Service {
    appName = 'dashboard';
    view = 'menu_category';

    public updateIndexes = (indexes: number[]): any => {
        return this._post(`${this.viewPath}/update_indexes/`, indexes);
    }
}

export default new MenuCategoryService();