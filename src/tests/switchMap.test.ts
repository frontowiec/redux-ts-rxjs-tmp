import {map, switchMap} from "rxjs/operators";
import {TestScheduler} from "rxjs/testing";

describe('SwitchMap', () => {
    it('should maps each value to inner obervable and flattens', () => {
        const scheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected);
        });

        scheduler.run(helpers => {
            const {cold, expectObservable} = helpers;
            const values = {a: 10, b: 30, x: 20, y: 40};
            const obs1 = cold('-a-----a--b-|', values);
            const obs2 = cold('a-a-a|', values);
            // const expected = cold('-20-20-20-20-xy-y-y|', values);

            const result = obs1.pipe(switchMap(x => obs2.pipe(map(y => x+y))));

            expectObservable(result).toBe('-x-x-x-x-xy-y-y|', values);
        });
    })
});