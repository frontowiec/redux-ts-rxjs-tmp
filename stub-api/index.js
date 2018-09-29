const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const v4 = require('uuid/v4');
const faker = require('faker');

app.use(bodyParser.json());
app.use(cors());

const calculateRebate = cardItems => Object.keys(cardItems).length * 0.5;
const calculateShippingCosts = cardItems => Object.keys(cardItems).length + 1;

const cards = {};
const orders = {};
const offers = {};

app.post('/api/:purchaserId/card', (req, res) => {
    const cardId = v4();
    const card = {
        id: cardId,
        total: Object.keys(req.body.items).length * 10,
        items: req.body.items
    };

    cards[cardId] = card;

    res.send(card);
});

app.get('/api/:purchaserId/card/:cardId/calculateRebate', (req, res) => {
    const {cardId} = req.params;
    res.send({rebate: calculateRebate(cards[cardId].items)})
});

app.get('/api/:purchaserId/card/:cardId/calculateShippingCosts', (req, res) => {
    const {cardId} = req.params;
    res.send({shippingCosts: calculateShippingCosts(cards[cardId].items)})
});

app.post('/api/:purchaserId/card/:cardId/offer', (req, res) => {
    const {cardId} = req.params;
    const {rebate, shippingCosts} = req.body;
    const card = cards[cardId];
    const offerId = v4();
    const offer = {
        id: offerId,
        cardId: card.id,
        rebate,
        shippingCosts,
        total: card.total - rebate + shippingCosts
    };

    offers[offerId] = offer;

    res.status(201).send(offer); // todo: {offer}
});

app.post('/api/:purchaserId/offer/:offerId/accept', (req, res) => {
    res.status(204).send();
});

app.post('/api/:purchaserId/offer/:offerId/reject', (req, res) => {
    res.status(204).send();
});

app.post('/api/:purchaserId/order', (req, res) => {
    const {body: {offerId}} = req;
    const orderId = v4();
    const order = {
        id: orderId,
        offerId,
        purchaserId: v4(),
        status: 'created'
    };

    orders[orderId] = order;

    setTimeout(() => {
        order.status = 'in_progress';
    }, 3000);

    setTimeout(() => {
        order.status = 'completed';
    }, 7000);

    res.status(201).send({order});
});

app.get('/api/:purchaserId/order/:orderId', (req, res) => {
    const {orderId} = req.params;
    res.status(200).send({order: orders[orderId]});
});

app.listen(5000);

module.exports = app;
