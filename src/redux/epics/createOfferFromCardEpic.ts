import {getJSON, postJSON} from "@ajax";
import {StandardEpic} from "@redux/utilities";
import {ofType} from "redux-observable";
import {combineLatest, of} from "rxjs";
import {catchError, map, switchMap, withLatestFrom} from "rxjs/operators";
import {getType} from "typesafe-actions";
import {createdOffer, createdOfferFailure, createOffer, Offer} from "../modules/offer";

export const createOfferFromCardEpic$: StandardEpic = (action$, state$) => action$.pipe(
    ofType(getType(createOffer)),
    withLatestFrom(state$),
    switchMap(([action, {card, purchaser}]) => combineLatest(
        of({cardId: card.id, purchaserId: purchaser.id}),
        getJSON<{rebate: number}>(`${purchaser.id}/card/${card.id}/calculateRebate`),
        getJSON<{shippingCosts: number}>(`${purchaser.id}/card/${card.id}/calculateShippingCosts`)
    )),
    switchMap(([{cardId, purchaserId}, {rebate}, {shippingCosts}]) =>
        postJSON<Offer>(`${purchaserId}/card/${cardId}/offer`, {rebate, shippingCosts})
            .pipe(
                map(offer => createdOffer(offer)),
                catchError(err => of(createdOfferFailure(err)))
            ))
);