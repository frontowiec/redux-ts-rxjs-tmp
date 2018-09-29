import {getJSON, postJSON} from "@ajax";
import {acceptedOffer} from "@redux/modules/offer";
import {Action, StandardEpic} from "@redux/utilities";
import {combineEpics, ofType} from "redux-observable";
import {concat, of} from "rxjs";
import {catchError, delay, filter, flatMap, map, switchMap, withLatestFrom} from "rxjs/operators";
import {ActionType, getType} from "typesafe-actions";
import {
    checkOrderStatus,
    checkOrderStatusFailure,
    completedStatusOrder,
    createdOrder,
    createdOrderFailure,
    createdStatusOrder,
    createOrder,
    inProgressStatusOrder, Order,
    OrderStatus
} from "../modules/order";

// kiedy typujemy epiki ?
// 1. Gdy potrzeby jest nam payload akcji wejściowej
// 2. Gdy nasz epik jest wejście do innego epiku wtedy jako drugi parametr w generuku
// typujemy akcje wyjściową

// todo: czy opłaca się wstrzykiwać zależności ?
const createOrderWhenOfferWasAccepted$: StandardEpic<ActionType<typeof acceptedOffer>> = action$ => action$.pipe(
    ofType(getType(acceptedOffer)),
    map(({payload}) => createOrder({offerId: payload}))
);

const createOrder$: StandardEpic<ActionType<typeof createOrder>> = (action$, state$) => action$.pipe(
    ofType(getType(createOrder)),
    withLatestFrom(state$),
    switchMap(([{payload}, {purchaser}]) => postJSON<{ order: Order }>(`${purchaser.id}/order`, {offerId: payload.offerId}).pipe(
        flatMap(({order}) => concat(of(createdOrder(order)), of(createdStatusOrder(order.id)))),
        catchError(err => of(createdOrderFailure(err)))
    ))
);

const checkIfOrderChangeStatus$: StandardEpic<Action<string>> = (action$, state$) => action$.pipe(
    ofType(getType(checkOrderStatus), getType(createdStatusOrder), getType(inProgressStatusOrder)),
    withLatestFrom(state$),
    filter(([{payload}, {order}]) => order[payload].status !== OrderStatus.COMPLETED),
    switchMap(([{payload}, {purchaser}]) => getJSON<{ order: Order }>(`${purchaser.id}/order/${payload}`).pipe(
        map(({order}) => {
            if (order.status === OrderStatus.IN_PROGRESS) {
                return inProgressStatusOrder(order.id);
            }
            if (order.status === OrderStatus.COMPLETED) {
                return completedStatusOrder(order.id);
            }
            return checkOrderStatus(order.id);
        }),
        delay(1000),
        catchError(err => of(checkOrderStatusFailure(err)))
    ))
);

// todo: obsługa rejectedOrder

export const createOrderFromOffer$ = combineEpics(createOrderWhenOfferWasAccepted$, createOrder$, checkIfOrderChangeStatus$);