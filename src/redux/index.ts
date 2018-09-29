import {NotificationsState, reducer as notifications} from 'react-notification-system-redux';
import {combineReducers} from "redux";
import {combineEpics} from "redux-observable";
import {createOfferFromCardEpic$} from "./epics/createOfferFromCardEpic";
import {createOrderFromOffer$} from "./epics/createOrderFromOfferEpic";
import card, {CardState} from "./modules/card";
import offer, {OfferState} from "./modules/offer";
import order, {OrderState} from "./modules/order";
import purchaser from "./modules/purchaser";

export interface RootState {
    notifications: NotificationsState;
    card: CardState;
    offer: OfferState;
    order: OrderState;
    purchaser: {id: string}
}

export const rootEpic$ = combineEpics(createOfferFromCardEpic$, createOrderFromOffer$);
export default combineReducers<RootState>({notifications, card, offer, order, purchaser});
