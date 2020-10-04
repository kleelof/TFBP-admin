import moment from 'moment';

class MomentHelper {

    public asDateSlug = (date: any, useUTC: boolean = false): string => {
        if (useUTC) {
            return moment(date).utc().format('YYYY-MM-DD');
        } else {
            return moment(date).format('YYYY-MM-DD');
        }
    }

    public asFullDate = (date: any): string => {
        return moment(date).utc().format('dddd MMMM D, YYYY');
    }

    public asFullDateTime = (dateTime: any): string => {
        return moment(dateTime).format('dddd MMMM D, YYYY h:mm a')
    }

    public asShortDate = (date: any): string => {
        return moment(date).utc().format('MMM D YYYY');
    }

    public asShortDateTime = (dateTime: any): string => {
        return moment(dateTime).format('MMM D YYYY h:mm a')
    }
}

export default new MomentHelper();