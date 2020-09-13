import moment from 'moment';

class MomentHelper {

    public asFullDate = (date: any): string => {
        return moment(date).utc().format('MMMM DDD, YYYY')
    }
}

export default new MomentHelper();