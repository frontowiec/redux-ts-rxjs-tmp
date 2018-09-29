import {postJSON} from "@ajax";
import {Action} from "@redux/utilities";
import {Dispatch} from "redux";
import {createActions, handleActions} from "redux-actions";

export interface Item {
    id: string;
    name: string;
    regularPrice: number;
    quantity: number;
}

export interface CardItem {
    [itemId: string]: Item
}

export interface CardState {
    id?: string;
    total: number;
    items: CardItem
}

const initialState: CardState = {
    total: 30,
    items: {}
};

export const {createdCard, createdCardFailure} =
    createActions(
        'CREATED_CARD',
        'CREATED_CARD_FAILURE'
    );

export const createCard = (purchaserId: string, items: CardItem): any =>
    (dispatch: Dispatch) => {
        dispatch({type: 'CREATE_CARD'});
        postJSON<CardItem>(`${purchaserId}/card`, {items}).toPromise()
            .then((cardItems: CardItem) => dispatch(createdCard(cardItems)))
            .catch(() => dispatch(createdCardFailure()))
    };

export default handleActions<CardState, unknown>({
    [createdCard.toString()]: (state, {payload}: Action<CardState>) => payload,
    [createdCardFailure.toString()]: state => state
}, initialState);