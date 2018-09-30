import {Order, OrderStatus} from "@redux/modules/order";
import {v4} from 'uuid';

export const generateOrder = (status = OrderStatus.CREATED): Order => ({
    id: v4(),
    offerId: v4(),
    status,
    purchaserId: v4(),
});