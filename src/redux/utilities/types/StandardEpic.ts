import {RootState} from "@redux/index";
import {Action} from "redux";
import {ActionsObservable, StateObservable} from "redux-observable";
import {Observable} from "rxjs";

// https://github.com/redux-observable/redux-observable/issues/560
export type StandardEpic<Input extends Action = any, Output = unknown, Dependencies = any> =
    (action$: ActionsObservable<Input>, state$: StateObservable<RootState>, dependencies: Dependencies) => Observable<Output>;