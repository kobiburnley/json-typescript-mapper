import {ICustomConverter} from '../../src/index';

const dateConverter: ICustomConverter = {
    fromJson(data: any): any {
        return new Date(data);
    }
};

export default dateConverter;