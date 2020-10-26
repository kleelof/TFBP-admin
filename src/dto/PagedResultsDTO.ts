import ModelBase from "../models/ModelBase";

export default class PagedResultsDTO {

    public count!: number;
    public next!: string | null;
    public previous!: string | null;
    public results!: any[]

    constructor(
        count: number = 0,
        results: ModelBase[] = []
    ) {
        this.count = count;
        this.results = results;
    }
}