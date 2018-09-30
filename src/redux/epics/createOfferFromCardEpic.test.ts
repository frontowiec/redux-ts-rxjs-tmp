import * as ajax from '@ajax';
import {createOfferFromCardEpic$} from "@redux/epics/createOfferFromCardEpic";
import {createdOffer, createdOfferFailure, createOffer} from "@redux/modules/offer";
import {it$} from "@redux/utilities/it";
import {generateOffer} from "@redux/utilities/offerGenerator";
import {of, throwError} from "rxjs";

// celem testów epicowych jest sprawdzenie poprawności orkietracji akcji

it$('should calculate rebate and shipping costs and create offer', ({cold, hot, expectObservable}) => {
    const offer = generateOffer();
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
});

it$('should dispatch event on create offer failure', ({hot, cold, expectObservable}) => {
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
});
