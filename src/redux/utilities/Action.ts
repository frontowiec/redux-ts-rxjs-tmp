import {BaseAction} from "redux-actions";

export interface Action<Payload> extends BaseAction {
    payload: Payload;
}
