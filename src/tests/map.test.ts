import {map} from "rxjs/operators";
import {TestScheduler} from "rxjs/testing";

it('map', () => {
    const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    scheduler.run(helpers => {
        const {cold, expectObservable} = helpers;

        const values = {a: 1, b: 2, c: 3, x: 2, y: 3, z: 4};
        const source = cold('-a-b-c-|', values);

        const result = source.pipe(map(x => x + 1));
        expectObservable(result).toBe("-x-y-z-|", values)
    })
});
