import {Position} from '../interfaces/position';
import {Properties} from '../interfaces/properties';

export class CustomBlob {
    id: number;
    moveSet: string;
    currentMoveSetPosition = 0;
    position: Position;
    properties: Properties;
}
