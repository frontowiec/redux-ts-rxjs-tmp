import * as ajax from '@ajax';
import {createOrderFromOffer$} from "@redux/epics/createOrderFromOfferEpic";
import {acceptedOffer} from "@redux/modules/offer";
import {
    checkOrderStatus, checkOrderStatusFailure,
    completedStatusOrder,
    createdOrder, createdOrderFailure,
    createdStatusOrder,
    createOrder, inProgressStatusOrder,
    OrderStatus
} from "@redux/modules/order";
import {it} from "@redux/utilities/it";
import {generateOrder} from "@redux/utilities/orderGenerator";
import {of, throwError} from "rxjs";

it('should create order after accepting offer', ({hot, expectObservable}) => {
    const state: any = of({});

    const values = {
        a: acceptedOffer('123'),
        x: createOrder({offerId: '123'})
    };
    const source: any = hot('-a', values);

    const result = createOrderFromOffer$(source, state, {});
    expectObservable(result).toBe("-x", values)
});

it('should create order', ({cold, hot, expectObservable}) => {
    const order = generateOrder();

    // @ts-ignore
    ajax.postJSON = () => cold('-a', {a: {order}});

    const values = {
        a: createOrder({offerId: '123'}),
        x: createdOrder(order),
        y: createdStatusOrder(order.id)
    };
    const source: any = hot('-a', values);
    const state: any = of({purchaser: {id: '321'}});

    const result = createOrderFromOffer$(source, state, {});
    expectObservable(result).toBe("--(xy)", values);
});

it('should check order status if order status was created', ({cold, hot, expectObservable}) => {
    const orderInCreatedStatus = generateOrder();
    const orderId = orderInCreatedStatus.id;

    // @ts-ignore
    ajax.getJSON = () => cold('-a', {a: {order: orderInCreatedStatus}});

    const values = {
        a: createdStatusOrder(orderId),
        x: checkOrderStatus(orderId)
    };
    const source: any = hot('-a', values);
    const state: any = of({
        purchaser: {id: orderInCreatedStatus.purchaserId},
        order: {[orderId]: orderInCreatedStatus}
    });

    const result = createOrderFromOffer$(source, state, {});
    expectObservable(result).toBe("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------x", values);
});

it('should check order status', ({cold, hot, expectObservable}) => {
    const orderInProgress = generateOrder(OrderStatus.IN_PROGRESS);
    const orderInCompleted = ({...orderInProgress, status: OrderStatus.COMPLETED});
    const orderId = orderInProgress.id;

    // @ts-ignore
    ajax.getJSON = () => cold('-a', {a: {order: orderInCompleted}});

    const values = {
        a: checkOrderStatus(orderId),
        x: completedStatusOrder(orderId)
    };
    const source: any = hot('-a', values);
    const state: any = of({purchaser: {id: orderInProgress.purchaserId}, order: {[orderId]: orderInProgress}});

    const result = createOrderFromOffer$(source, state, {});
    expectObservable(result).toBe("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------x", values);
});

it('should check order status if order status is in progress', ({cold, hot, expectObservable}) => {
    const orderInProgress = generateOrder(OrderStatus.IN_PROGRESS);
    const orderId = orderInProgress.id;

    // @ts-ignore
    ajax.getJSON = () => cold('-a', {a: {order: orderInProgress}});

    const values = {
        a: checkOrderStatus(orderId),
        x: inProgressStatusOrder(orderId)
    };
    const source: any = hot('-a', values);
    const state: any = of({purchaser: {id: orderInProgress.purchaserId}, order: {[orderId]: orderInProgress}});

    const result = createOrderFromOffer$(source, state, {});
    expectObservable(result).toBe("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------x", values);
});

it('should dispatch event on created action failure', ({hot, expectObservable}) => {
    // @ts-ignore
    ajax.postJSON = () => throwError({});

    const values = {
        a: createOrder({offerId: '123'}),
        x: createdOrderFailure({})
    };
    const source: any = hot('-a', values);
    const state: any = of({purchaser: {id: '321'}});

    const result = createOrderFromOffer$(source, state, {});
    expectObservable(result).toBe("-x", values);
});

it('should dispatch event on check order status failure', ({hot, expectObservable}) => {
    const orderInProgress = generateOrder(OrderStatus.IN_PROGRESS);
    const orderId = orderInProgress.id;

    // @ts-ignore
    ajax.getJSON = () => throwError({});

    const values = {
        a: checkOrderStatus(orderId),
        x: checkOrderStatusFailure({})
    };
    const source: any = hot('-a', values);
    const state: any = of({purchaser: {id: orderInProgress.purchaserId}, order: {[orderId]: orderInProgress}});

    const result = createOrderFromOffer$(source, state, {});
    expectObservable(result).toBe("-x", values);
});