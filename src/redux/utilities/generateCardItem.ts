import {v4} from 'uuid';
import {CardItem} from "../modules/card";

export const generateCardItem = (): CardItem => {
    const id = v4();

    return {
        [id]: {
            id,
            name: `Item ${id}`,
            quantity: 1,
            regularPrice: 10
        }
    }
};
