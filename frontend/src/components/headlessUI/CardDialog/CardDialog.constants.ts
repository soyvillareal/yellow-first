import moment from 'moment';

export const cardDialogInitialValues = {
  cardNumber: '',
  cardHolder: '',
  cardMonth: moment().format('MM'),
  cardYear: moment().format('YYYY'),
  cardCvv: '',
};
