import reducer, {CardItem, CardState, createdCard} from "@redux/modules/card";

describe('Reducers', () => {
    // todo: bez sensu ten reducer - do przemyślenia na nowo
    it('should create card', () => {
        const initialState: CardState = {
            items: {},
            total: 0
        };
        const card: CardItem = {
            '1': {
                id: '1',
                name: 'Item#1',
                regularPrice: 100,
                quantity: 1
            }
        };
        const newState = reducer(initialState, createdCard(card));
        const expectedState = {'1': card};

        expect(newState).toEqual(expectedState);
    });
});

describe('Thunks', () => {
 // todo: https://michalzalecki.com/testing-redux-thunk-like-you-always-want-it/
});
