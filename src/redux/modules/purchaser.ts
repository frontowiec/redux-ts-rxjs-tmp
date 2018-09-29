import {handleActions} from "redux-actions";
import {v4} from 'uuid';

export default handleActions({}, {id: v4()})