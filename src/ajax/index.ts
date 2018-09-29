import {Observable} from "rxjs";
import {ajax} from "rxjs/ajax";
import {map} from "rxjs/operators";
import {API_HOST} from "../apiConfig";

const defaultHeaders = {
    'Content-Type': 'application/json'
};

export const getJSON = <T  = unknown>(url: string): Observable<T> =>
    ajax.get(`${API_HOST}${url}`, defaultHeaders).pipe(
        map(({response}) => response)
    );

export const postJSON = <T = unknown>(url: string, body: unknown): Observable<T> =>
    ajax.post(`${API_HOST}${url}`, body, defaultHeaders).pipe(
        map(({response}) => response)
    );