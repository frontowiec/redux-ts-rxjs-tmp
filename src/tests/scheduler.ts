import {TestScheduler} from "rxjs/testing";

export const scheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected); // todo: po co to?
});
