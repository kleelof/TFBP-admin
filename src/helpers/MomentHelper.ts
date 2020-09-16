import moment from 'moment';

class MomentHelper {

    public asDateSlug = (date: any): string => {
        return moment(date).utc().format('YYYY-MM-DD');
    }

    public asFullDate = (date: any): string => {
        return moment(date).utc().format('dddd MMMM D, YYYY');
    }

    public asShortDate = (date: any): string => {
        return moment(date).utc().format('MMM D YYYY');
    }
}

export default new MomentHelper();