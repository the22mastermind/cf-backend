const userSample = {
  productReviewValid: {
    vote: '4.5',
    comment: 'Some good review comment goes here.',
  },
  productReviewValidTwo: {
    vote: '5.0',
    comment: 'Very nice product. Highly recomend it, blah blah blah.',
  },
  productReviewValidThree: {
    vote: '3.0',
    comment: 'Average product. Not recomended to someone who wants high quality stuff, blah blah blah.',
  },
  productReviewEmptyVote: {
    vote: '',
    comment: 'Some good review comment goes here.',
  },
  productReviewEmptyComment: {
    vote: '4.0',
    comment: '',
  },
  productReviewInvalidVote: {
    vote: '4',
    comment: 'Some good review comment goes here',
  },
  validOrder: {
    address: 'Kacyiru, KG 8 Ave, 7',
    paymentMode: 'MOMO',
    currency: 'RWF',
    total: '19000',
    contents: [
      {
        productId: 1,
        productName: 'Mango Juice',
        quantity: 3,
        cost: 6000,
      },
      {
        productId: 2,
        productName: 'Cappuccino',
        quantity: 4,
        cost: 12000,
      },
    ],
  },
  validOrderTwo: {
    address: 'Kacyiru, KG 8 Ave, 7',
    paymentMode: 'CASH',
    currency: 'RWF',
    total: '13000',
    contents: [
      {
        productId: 1,
        productName: 'Mango Juice',
        quantity: 3,
        cost: 6000,
      },
      {
        productId: 2,
        productName: 'Cappuccino',
        quantity: 2,
        cost: 6000,
      },
    ],
  },
  validOrderThree: {
    address: 'Kacyiru, KG 8 Ave, 7',
    paymentMode: 'CARD',
    currency: 'RWF',
    total: '11000',
    contents: [
      {
        productId: 1,
        productName: 'Mango Juice',
        quantity: 5,
        cost: 10000,
      },
    ],
  },
  emptyContentsOrder: {
    address: 'Kacyiru, KG 8 Ave, 7',
    paymentMode: 'CARD',
    currency: 'RWF',
    total: '11000',
    contents: [],
  },
  invalidContentsOrder: {
    address: 'Kacyiru, KG 8 Ave, 7',
    paymentMode: 'CARD',
    currency: 'RWF',
    total: '11000',
    contents: [
      {
        a: 'aaaa',
      },
    ],
  },
};

export default userSample;
