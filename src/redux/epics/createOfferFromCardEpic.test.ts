import * as ajax from '@ajax';
import {createOfferFromCardEpic$} from "@redux/epics/createOfferFromCardEpic";
import {createdOffer, createdOfferFailure, createOffer, Offer, OfferStatus} from "@redux/modules/offer";
import {of, throwError} from "rxjs";
import {TestScheduler} from "rxjs/testing";

it('should calculate rebate and shipping costs and create offer', () => {
    const scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
    scheduler.run(helpers => {
        const {cold, hot, expectObservable} = helpers;
        const offer: Offer = {
          id: '1',
          cardId: '2',
          rebate: 10,
          shippingCosts: 10,
          total: 100,
          status: OfferStatus.ACCEPTED
        };
        const actions = {
            a: createOffer(),
            x: createdOffer(offer)
        };
        const state$: any = of({purchaser: {id: '321'}, card: {id: '2'}});

        // @ts-ignore
        ajax.getJSON = () => cold('-a', {a: 10});
        // @ts-ignore
        ajax.postJSON = () => cold('-a', {a: offer});

        const source$: any = hot('-a', actions);
        const results = createOfferFromCardEpic$(source$, state$, {});

        expectObservable(results).toBe('---x', actions);
    })
});

it('should dispatch event on create offer failure', () => {
    const scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));

    scheduler.run(helpers => {
        const {hot, cold, expectObservable} = helpers;
        const actions = {
            a: createOffer(),
            x: createdOfferFailure({})
        };
        const state$: any = of({purchaser: {id: '321'}, card: {id: '2'}});
        // @ts-ignore
        ajax.getJSON = () => cold('-a', {a: 10});
        // @ts-ignore
        ajax.postJSON = () => throwError({});

        const source$: any = hot('-a', actions);
        const results = createOfferFromCardEpic$(source$, state$, {});

        expectObservable(results).toBe('--x', actions);
    })
});
