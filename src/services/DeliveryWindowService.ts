import Service from './Service';

class DeliveryWindowService extends Service {
    appName = 'operator_app';
    view = 'delivery_window'
}

export default new DeliveryWindowService()