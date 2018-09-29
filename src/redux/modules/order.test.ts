import {completedStatusOrder, createdStatusOrder, inProgressStatusOrder} from "@redux/modules/order";
import reducer, {createdOrder, Order, OrderState, OrderStatus} from './order';

describe('Reducers', () => {
    it('should create order', () => {
        const initialState: OrderState = {};
        const order: Order = {
            id: '1',
            offerId: '2',
            status: OrderStatus.CREATED,
            purchaserId: '321'
        };
        const newState = reducer(initialState, createdOrder(order));
        const expectedState = {'1': {...order}};

        expect(newState).toEqual(expectedState);
    });

    it('should set order status to created', () => {
        const order: Order = {
            id: '1',
            offerId: '2',
            status: OrderStatus.CREATED,
            purchaserId: '321'
        };
        const initialState: OrderState = {'1': order};
        const newState = reducer(initialState, createdStatusOrder('1'));
        const expectedState = {'1': {...order, status: OrderStatus.CREATED}};

        expect(newState).toEqual(expectedState);
    });

    it('should set order status to in_progress', () => {
        const order: Order = {
            id: '1',
            offerId: '2',
            status: OrderStatus.CREATED,
            purchaserId: '321'
        };
        const initialState: OrderState = {'1': order};
        const newState = reducer(initialState, inProgressStatusOrder('1'));
        const expectedState = {'1': {...order, status: OrderStatus.IN_PROGRESS}};

        expect(newState).toEqual(expectedState);
    });

    it('should set order status to completed', () => {
        const order: Order = {
            id: '1',
            offerId: '2',
            status: OrderStatus.CREATED,
            purchaserId: '321'
        };
        const initialState: OrderState = {'1': order};
        const newState = reducer(initialState, completedStatusOrder('1'));
        const expectedState = {'1': {...order, status: OrderStatus.COMPLETED}};

        expect(newState).toEqual(expectedState);
    });
});
