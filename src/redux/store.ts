import {AnyAction, applyMiddleware, createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension';
import {createEpicMiddleware} from 'redux-observable';
import thunk from 'redux-thunk';
import rootReducer, {rootEpic$, RootState} from "./index";

const epicMiddleware = createEpicMiddleware<AnyAction, AnyAction, RootState>();

export default function configureStore() {
    const store = createStore(
        rootReducer,
        composeWithDevTools(applyMiddleware(thunk, epicMiddleware))
    );

    epicMiddleware.run(rootEpic$);

    return store;
}
