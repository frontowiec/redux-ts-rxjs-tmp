import {Offer, OfferStatus} from "@redux/modules/offer";
import {v4} from 'uuid';

export const generateOffer = (status = OfferStatus.ACCEPTED): Offer => ({
    id: v4(),
    cardId: v4(),
    rebate: 10,
    shippingCosts: 10,
    total: 100,
    status
});