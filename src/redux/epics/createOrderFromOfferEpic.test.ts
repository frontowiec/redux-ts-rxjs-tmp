import * as ajax from '@ajax';
import {createOrderFromOffer$} from "@redux/epics/createOrderFromOfferEpic";
import {acceptedOffer} from "@redux/modules/offer";
import {
    checkOrderStatus, checkOrderStatusFailure,
    completedStatusOrder,
    createdOrder, createdOrderFailure,
    createdStatusOrder,
    createOrder, inProgressStatusOrder,
    Order,
    OrderStatus
} from "@redux/modules/order";
import {of, throwError} from "rxjs";
import {TestScheduler} from "rxjs/testing";

it('should create order after accepting offer', () => {
    const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    scheduler.run(helpers => {
        const {hot, expectObservable} = helpers;

        const state: any = of({});

        const values = {
            a: acceptedOffer('123'),
            x: createOrder({offerId: '123'})
        };
        const source: any = hot('-a', values);

        const result = createOrderFromOffer$(source, state, {});
        expectObservable(result).toBe("-x", values)
    });
});

it('should create order', () => {
    const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    scheduler.run(helpers => {
        const {cold, hot, expectObservable} = helpers;
        const order: Order = {
            id: '1',
            offerId: '123',
            status: OrderStatus.CREATED,
            purchaserId: '321',
        };

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
});

it('should check order status if order status was created', () => {
    const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    scheduler.run(helpers => {
        const {cold, hot, expectObservable} = helpers;
        const orderInCreatedStatus: Order = {
            id: '1',
            offerId: '123',
            status: OrderStatus.CREATED,
            purchaserId: '321',
        };

        // @ts-ignore
        ajax.getJSON = () => cold('-a', {a: {order: orderInCreatedStatus}});

        const values = {
            a: createdStatusOrder('1'),
            x: checkOrderStatus('1')
        };
        const source: any = hot('-a', values);
        const state: any = of({purchaser: {id: '321'}, order: {'1': orderInCreatedStatus}});

        const result = createOrderFromOffer$(source, state, {});
        expectObservable(result).toBe("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------x", values);
    });
});

it('should check order status', () => {
    const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    scheduler.run(helpers => {
        const {cold, hot, expectObservable} = helpers;
        const orderInProgress: Order = {
            id: '1',
            offerId: '123',
            status: OrderStatus.IN_PROGRESS,
            purchaserId: '321',
        };
        const orderInCompleted: Order = {
            id: '1',
            offerId: '123',
            status: OrderStatus.COMPLETED,
            purchaserId: '321',
        };

        // @ts-ignore
        ajax.getJSON = () => cold('-a', {a: {order: orderInCompleted}});

        const values = {
            a: checkOrderStatus('1'),
            x: completedStatusOrder('1')
        };
        const source: any = hot('-a', values);
        const state: any = of({purchaser: {id: '321'}, order: {'1': orderInProgress}});

        const result = createOrderFromOffer$(source, state, {});
        expectObservable(result).toBe("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------x", values);
    });
});

it('should check order status if order status is in progress', () => {
    const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    scheduler.run(helpers => {
        const {cold, hot, expectObservable} = helpers;
        const orderInProgress: Order = {
            id: '1',
            offerId: '123',
            status: OrderStatus.IN_PROGRESS,
            purchaserId: '321',
        };

        // @ts-ignore
        ajax.getJSON = () => cold('-a', {a: {order: orderInProgress}});

        const values = {
            a: checkOrderStatus('1'),
            x: inProgressStatusOrder('1')
        };
        const source: any = hot('-a', values);
        const state: any = of({purchaser: {id: '321'}, order: {'1': orderInProgress}});

        const result = createOrderFromOffer$(source, state, {});
        expectObservable(result).toBe("------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------x", values);
    });
});

it('should dispatch event on created action failure', () => {
    const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    scheduler.run(helpers => {
        const {hot, expectObservable} = helpers;
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
});

it('should dispatch event on check order status failure', () => {
    const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    scheduler.run(helpers => {
        const {hot, expectObservable} = helpers;
        const orderInProgress: Order = {
            id: '1',
            offerId: '123',
            status: OrderStatus.IN_PROGRESS,
            purchaserId: '321',
        };

        // @ts-ignore
        ajax.getJSON = () => throwError({});

        const values = {
            a: checkOrderStatus('1'),
            x: checkOrderStatusFailure({})
        };
        const source: any = hot('-a', values);
        const state: any = of({purchaser: {id: '321'}, order: {'1': orderInProgress}});

        const result = createOrderFromOffer$(source, state, {});
        expectObservable(result).toBe("-x", values);
    });
});