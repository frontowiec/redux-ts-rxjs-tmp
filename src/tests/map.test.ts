import {map} from "rxjs/operators";
import {scheduler} from "./scheduler";

it('map', () => {
    scheduler.run(helpers => {
        const {cold, expectObservable} = helpers;

        const values = {a: 1, b: 2, c: 3, x: 2, y: 3, z: 4};
        const source = cold('-a-b-c-|', values);

        const result = source.pipe(map(x => x + 1));
        expectObservable(result).toBe("-x-y-z-|", values)
    })
});
