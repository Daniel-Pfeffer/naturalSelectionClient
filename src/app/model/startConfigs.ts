import {FoodConfig} from './foodConfig';

export class StartConfigs {
    startingPopulationSize: number;
    food: FoodConfig;
    mapSize: number;

    constructor(startingPopulationSize: number, food: FoodConfig, mapSize: number) {
        this.startingPopulationSize = startingPopulationSize;
        this.food = food;
        this.mapSize = mapSize;
    }
}
