export interface ICardDialogProps {
  open: boolean;
  onClose: () => void;
}

export interface ICardDialogInputs {
  cardNumber: string;
  cardHolder: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
}
