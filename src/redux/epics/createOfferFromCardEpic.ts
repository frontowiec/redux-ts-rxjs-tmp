import {Epic, ofType} from "redux-observable";
import {combineLatest, of} from "rxjs";
import {catchError, map, switchMap, withLatestFrom} from "rxjs/operators";
import {createdOffer, createdOfferFailure, createOffer} from "../modules/offer";

/*interface CreateOfferBody {
    rebate: number;
    shippingCosts: number;
}*/

export const createOfferFromCardEpic$: Epic = (action$, state$, {getJSON, postJSON}) => action$.pipe(
    ofType(createOffer.toString()),
    withLatestFrom(state$),
    switchMap(([action, state]) => combineLatest(
        of({cardId: state.card.id, purchaserId: state.purchaser.id}),
        getJSON(`${state.purchaser.id}/card/${state.card.id}/calculateRebate`),
        getJSON(`${state.purchaser.id}/card/${state.card.id}/calculateShippingCosts`)
    )),
    switchMap(([{cardId, purchaserId}, {rebate}, {shippingCosts}]: any) =>
        postJSON(`${purchaserId}/card/${cardId}/offer`, {rebate, shippingCosts})
            .pipe(
                map(offer => createdOffer(offer)),
                catchError(err => of(createdOfferFailure(err)))
            ))
);