import {RunHelpers} from "rxjs/internal/testing/TestScheduler";
import {TestScheduler} from "rxjs/testing";

export const it = <T>(desc: string, callback: (helpers: RunHelpers) => void) => {
    const scheduler = new TestScheduler((actual, expected) => expect(actual).toEqual(expected));
    return test(desc, () => scheduler.run(callback));
};