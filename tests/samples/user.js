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
};

export default userSample;
