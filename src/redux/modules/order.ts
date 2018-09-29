import {handleActions} from "redux-actions";
import {ActionType, createStandardAction, getType} from "typesafe-actions";

export enum OrderStatus {
    CREATED = 'created',
    IN_PROGRESS = 'in_progress',
    COMPLETED = 'completed'
}

export interface Order {
    id: string;
    offerId: string;
    purchaserId: string;
    status: OrderStatus;
    createdError?: unknown;
}

export interface OrderState {
    [id: string]: Order
}

const initialState: OrderState = {};

export const {createOrder, createdOrder, createdOrderFailure, checkOrderStatus, createdStatusOrder, inProgressStatusOrder, completedStatusOrder, checkOrderStatusFailure} = {
    createOrder: createStandardAction('CREATE_ORDER')<{ offerId: string }>(),
    createdOrder: createStandardAction('CREATED_ORDER')<Order>(),
    createdOrderFailure: createStandardAction('CREATED_ORDER_FAILURE')<unknown>(),
    checkOrderStatus: createStandardAction('CHECK_ORDER_STATUS')<string>(),
    createdStatusOrder: createStandardAction('CREATED_STATUS_ORDER')<string>(),
    inProgressStatusOrder: createStandardAction('IN_PROGRESS_STATUS_ORDER')<string>(),
    completedStatusOrder: createStandardAction('COMPLETED_STATUS_ORDER')<string>(),
    checkOrderStatusFailure: createStandardAction('CHECK_ORDER_STATUS_FAILURE')<unknown>()
};

// todo: wypnij metodę handleActions do własnego helpera
export default handleActions<OrderState, unknown>({
    [getType(createdOrder)]: (state, {payload}: ActionType<typeof createdOrder>) => ({...state, [payload.id]: payload}),
    [getType(createdOrderFailure)]: state => state, // todo
    [getType(createdStatusOrder)]: (state, {payload}: ActionType<typeof createdStatusOrder>) => changeOrderStatus(payload, OrderStatus.CREATED, state),
    [getType(inProgressStatusOrder)]: (state, {payload}: ActionType<typeof inProgressStatusOrder>) => changeOrderStatus(payload, OrderStatus.IN_PROGRESS, state),
    [getType(completedStatusOrder)]: (state, {payload}: ActionType<typeof completedStatusOrder>) => changeOrderStatus(payload, OrderStatus.COMPLETED, state),
    [getType(checkOrderStatusFailure)]: state => state
}, initialState);

const changeOrderStatus = (orderId: string, status: OrderStatus, state: OrderState): OrderState =>
    ({...state, [orderId!]: {...state[orderId!], status}});

/*interface PLAYLISTS_LOADED extends Action<"PLAYLISTS_LOADED"> {
    payload: Order;
}
interface PLAYLIST_SELECTED extends Action<"PLAYLIST_SELECTED"> {
    payload: string;
}

type Actions =
    | PLAYLISTS_LOADED
    | PLAYLIST_SELECTED;*/

/*
const reducer = handleActions<OrderState, Actions>({
    ['PLAYLISTS_LOADED']: (state, {payload}) => ({...state, '2': payload}),
    ['PLAYLIST_SELECTED']: (state) => state,
    ['DUPA']: (state) => state
}, initialState);*/
