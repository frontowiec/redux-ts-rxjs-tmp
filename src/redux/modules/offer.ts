import {postJSON} from "@ajax";
import {Action} from "@redux/utilities";
import {Dispatch} from "redux";
import {createActions, handleActions} from "redux-actions";
import {createStandardAction} from "typesafe-actions";

export enum OfferStatus {
    ACCEPTED = 'accepted',
    REJECTED = 'rejected'
}

export interface Offer {
    id: string;
    cardId: string;
    rebate: number;
    shippingCosts: number;
    total: number;
    status: OfferStatus | null;
}

export interface OfferState {
    [id: string]: Offer
}

const initialState: OfferState = {};

export const {createOffer, createdOffer, createdOfferFailure, acceptedOfferFailure, rejectedOffer, rejectedOfferFailure} =
    createActions(
        'CREATE_OFFER',
        'CREATED_OFFER',
        'CREATED_OFFER_FAILURE',
        'ACCEPTED_OFFER_FAILURE',
        'REJECTED_OFFER',
        'REJECTED_OFFER_FAILURE'
    );

export const acceptedOffer = createStandardAction('ACCEPTED_OFFER')<string>();

export const acceptOfferRequest = (offerId: string, purchaserId: string): any => (dispatch: Dispatch) => {
    postJSON(`${purchaserId}/offer/${offerId}/accept`, {}).toPromise()
        .then(() => dispatch(acceptedOffer(offerId)))
        .catch(() => dispatch(acceptedOfferFailure(offerId)))
};

export const rejectOfferRequest = (offerId: string, purchaserId: string): any => (dispatch: Dispatch) => {
    postJSON(`${purchaserId}/offer/${offerId}/reject`, {}).toPromise()
        .then(() => dispatch(rejectedOffer(offerId)))
        .catch(() => dispatch(rejectedOfferFailure(offerId)))
};

export default handleActions<OfferState, unknown>({
    [createdOffer.toString()]: (state, {payload}: Action<Offer>) => ({...state, [payload.id]: payload}),
    [createdOfferFailure.toString()]: state => state,
    [acceptedOffer.toString()]: (state, {payload}: Action<string>) => changeOfferStatus(payload, OfferStatus.ACCEPTED, state),
    [acceptedOfferFailure.toString()]: state => state,
    [rejectedOffer.toString()]: (state, {payload}: Action<string>) => changeOfferStatus(payload, OfferStatus.REJECTED, state),
    [rejectedOfferFailure.toString()]: state => state,
}, initialState);

const changeOfferStatus = (orderId: string, status: OfferStatus, state: OfferState): OfferState =>
    ({...state, [orderId!]: {...state[orderId!], status}});