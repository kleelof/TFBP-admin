import moment from 'moment';

class MomentHelper {

    public asFullDate = (date: any): string => {
        return moment(date).utc().format('dddd MMMM D, YYYY');
    }

    public asDateSlug = (date: any): string => {
        return moment(date).utc().format('YYYY-MM-DD');
    }
}

export default new MomentHelper();