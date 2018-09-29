import * as ajax from '@ajax';
import {
    checkIfOrderChangeStatus$,
    createOrder$,
    createOrderWhenOfferWasAccepted$
} from "@redux/epics/createOrderFromOfferEpic";
import {acceptedOffer} from "@redux/modules/offer";
import {
    checkOrderStatus, completedStatusOrder,
    createdOrder,
    createdStatusOrder,
    createOrder,
    Order,
    OrderStatus
} from "@redux/modules/order";
import {of} from "rxjs";
import {scheduler} from "../../tests/scheduler";

// czy wszystkie strumienie opisywać przez cold lub hot ?

it('should create order after accepting offer', () => {
    scheduler.run(helpers => {
        const {cold, expectObservable} = helpers;

        const values = {
            a: acceptedOffer('123'),
            x: createOrder({offerId: '123'})
        };
        const source: any = cold('-a', values);
        const state: any = {};

        const result = createOrderWhenOfferWasAccepted$(source, state, {});
        expectObservable(result).toBe("-x", values)
    });
});

it('should create order', () => {
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

        const result = createOrder$(source, state, {});
        expectObservable(result).toBe("---(xy)", values);
    });
});

it('should check order status', () => {
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

        const result = checkIfOrderChangeStatus$(source, state, {});
        expectObservable(result).toBe("---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------x", values);
    });
});