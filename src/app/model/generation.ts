import {CustomBlob} from './custom-blob';
import {FoodConfig} from './foodConfig';
import {Food} from './food';

export class Generation {
    mapLength: number;
    blobs: Array<CustomBlob>;
    foodConfig: FoodConfig;
    food: Array<Food>;
    message?: string;
}
