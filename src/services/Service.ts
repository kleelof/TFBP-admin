import { config } from '../config';
import axiosInstance from './axiosApi';

interface AxiosResponse {
    data: any
}

export default class Service {
    protected _service_url: string = config.API_URL;
    protected appName: string = "";
    protected view: string = "";

    public get viewPath(): string {
        return `${this.appName}/${this.view}`;
    }

    public _get<T>(path: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            axiosInstance.get(`${this._service_url}/${path}`)
                .then ((resp: AxiosResponse) => {
                    resolve(resp.data);
                })
                .catch( err => reject(err))
        })
    }

    public _post<T>(path: string, content: any, headers?: any): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            axiosInstance.post(`${this._service_url}/${path}`, content, headers)
                .then((resp:AxiosResponse) => {
                    resolve(resp.data);
                })
                .catch( err => reject(err))
        })
    }

    public _patch<T>(path: string, content: any, headers?: any): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            axiosInstance.patch(`${this._service_url}/${path}`, content, headers)
                .then((resp: AxiosResponse) => {
                    resolve(resp.data)
                })
                .catch( err => reject(err));
        })
    }

    public _delete<T>(path: string): Promise<T> {
        return axiosInstance.delete(`${this._service_url}/${path}`)
    }

    public add<T>(DTO: T, useFormData: boolean = false): Promise<T> {
        //return new Promise<T>(() => {})
        if (useFormData){
            return this.multipartFormPost<T>(DTO);
        } else {
            return this._post<T>(`${this.appName}/${this.view}/`, DTO);
        }
    }

    public delete<T>(id: number): Promise<T> {
        return this._delete<T>(`${this.appName}/${this.view}/${id}/`);
    }

    public get<T>(id?: number): Promise<T> {
        if (id) {
            return this._get(`${this.appName}/${this.view}/${id}/`);
        } else {
            return this._get(`${this.appName}/${this.view}/`);
        }
    }

    public getByDate<T>(date: string): Promise<T> {
        return this._get<T>(`${this.appName}/${this.view}/get_by_date/?date=${date}`);
    }

    public getByDateRange<T>(startDate: string, endDate: string): Promise<T> {
        return this._get<T>(`${this.appName}/${this.view}/get_by_date_range/?start_date=${startDate}&end_date=${endDate}`);
    }

    public multipartFormPost<T>(content: any): Promise<T> {
        const formData: FormData = new FormData();
        Object.keys(content).forEach( key => {
            formData.append(key, content[key]);
        })
        console.log(formData);
        return this._post<T>(`${this.appName}/${this.view}/`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }

    public multipartFormUpdate<T>(id: number, content: any): Promise<T> {
        const formData: FormData = new FormData();
        Object.keys(content).forEach( key => {
            formData.append(key, content[key]);
        })
        console.log(formData);
        return this._patch<T>(`${this.appName}/${this.view}/${id}/`, formData, {headers: {'Content-Type': 'multipart/form-data'}});
    }

    public search<T>(search: String): Promise<T> {
        return this._get(`${this.appName}/${this.view}/?search=${search}`);
    }

    public softDelete<T>(id: number): Promise<T> {
        return this._get(`${this.appName}/${this.view}/soft_delete/${id}/`);
    }

    public update<T>(id: number, DTO: T, useFormData:boolean = false): Promise<T> {
        if (useFormData){
            return this.multipartFormUpdate<T>(id, DTO);
        } else {
            return this._patch<T>(`${this.appName}/${this.view}/${id}/`, DTO);
        }
    }
}