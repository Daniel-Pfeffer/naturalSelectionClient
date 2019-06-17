export class FoodConfig {
    foodAmount: number;
    /*
     *  2 is increase
     *  1 is decrease
     *  0 is static
     */
    isDecreasing?: number;
    amountChanging?: number;
    /*
     * if not specified minimumFood = maximumFood = foodAmount
     */
    minimumFood?: number;
    maximumFood?: number;

    constructor(foodAmount: number, isDecreasing?: number, amountChanging?: number, minimumFood?: number, maximumFood?: number) {
        this.foodAmount = foodAmount;
        this.isDecreasing = isDecreasing || 0;
        this.amountChanging = amountChanging || 0;
        this.minimumFood = minimumFood || foodAmount;
        this.maximumFood = maximumFood || foodAmount;
    }
}
