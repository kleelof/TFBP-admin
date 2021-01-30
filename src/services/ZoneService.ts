import Service from './Service';
import Zipcode from "../models/ZipcodeModel";
import Zone from "../models/ZoneModel";

class ZoneService extends Service {
    appName='dashboard';
    view='zone';

    public searchZipDb = (pageNumber?: number, city?: string): Promise<{id: number, name: string}> => {
        return this._get(`${this.viewPath}/search_zip_db/?city=${city}`);
    }

    public import_zip_codes = (zone: Zone, search_by: string, id: string | number): Promise<Zipcode[]> => {
        return this._post(`${this.viewPath}/${zone.id}/import_zip_codes/`, {search_by, id})
    }
}

export default new ZoneService();