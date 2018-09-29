/*tslint:disable:jsx-no-lambda*/
import {values} from 'lodash';
import * as React from 'react';
import {connect} from "react-redux";
import {Dispatch} from "redux";
import './App.css';
import {RootState} from "./redux";
import {generateCardItem} from "./redux/helpers";
import {CardItem, createCard, Item} from "./redux/modules/card";
import {acceptOfferRequest, createOffer, rejectOfferRequest} from "./redux/modules/offer";

class App extends React.Component<StateProps & DispatchProps> {
    componentDidMount() {
        this.props.createCard(this.props.purchaserId, {
            ...generateCardItem(),
            ...generateCardItem(),
            ...generateCardItem()
        });

        setTimeout(() => this.props.createOffer(), 2500);
    }

    render() {
        return (
            <div className="App">
                <dl>
                    {this.props.cardItems.map((item, index) => <dt key={index}>{item.name}</dt>)}
                </dl>
                <button onClick={() => this.props.acceptOffer(this.props.firstOfferId, this.props.purchaserId)}>Zamów</button>
                <button onClick={() => this.props.rejectOffer(this.props.firstOfferId, this.props.purchaserId)}>Odrzuć</button>
            </div>
        );
    }
}

const mapStateToProps = ({purchaser, card, offer}: RootState) => ({
    purchaserId: purchaser.id,
    cardItems: values<Item>(card.items),
    firstOfferId: Object.keys(offer)[0]
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
    createCard: (purchaserId: string, items: CardItem) => dispatch(createCard(purchaserId, items)),
    createOffer: () => dispatch(createOffer()),
    acceptOffer: (offerId: string, purchaserId: string) => dispatch(acceptOfferRequest(offerId, purchaserId)),
    rejectOffer: (offerId: string, purchaserId: string) => dispatch(rejectOfferRequest(offerId, purchaserId)),
});

interface StateProps {
    purchaserId: string;
    firstOfferId: string;
    cardItems: Item[];
}

interface DispatchProps {
    createCard: (purchaserId: string, items: CardItem) => void;
    createOffer: () => void;
    acceptOffer: (offerId: string, purchaserId: string) => void;
    rejectOffer: (offerId: string, purchaserId: string) => void;
}

export default connect<StateProps, DispatchProps>(mapStateToProps, mapDispatchToProps)(App);
