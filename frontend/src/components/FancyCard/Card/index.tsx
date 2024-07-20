import { CSSProperties, LegacyRef, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import './styles.scss';

import { cardType } from '@helpers/constants';

import { ICardProps } from './Card.types';

const cardBackgroundName = () => {
  const random = Math.floor(Math.random() * 25 + 1);
  return `${random}.jpeg`;
};

const BACKGROUND_IMG = cardBackgroundName();

const Card = ({
  cardHolder,
  cardNumber,
  cardMonth,
  cardYear,
  cardCvv,
  isCardFlipped,
  currentFocusedElm,
  onCardElementClick,
  cardNumberRef,
  cardHolderRef,
  cardDateRef,
}: ICardProps) => {
  const [style, setStyle] = useState<CSSProperties | undefined>(undefined);

  const useCardType = useMemo(() => {
    return cardType(cardNumber);
  }, [cardNumber]);

  const outlineElementStyle = (
    element: HTMLLabelElement | HTMLDivElement | undefined,
  ) => {
    return element
      ? {
          width: `${element.offsetWidth}px`,
          height: `${element.offsetHeight}px`,
          transform: `translateX(${element.offsetLeft}px) translateY(${element.offsetTop}px)`,
        }
      : undefined;
  };

  useEffect(() => {
    if (currentFocusedElm) {
      const style = outlineElementStyle(currentFocusedElm.current);
      setStyle(style);
    }
  }, [currentFocusedElm]);

  const maskCardNumber = (cardNumber: string) => {
    const cardNumberArr = cardNumber.split('');
    cardNumberArr.forEach((_, index) => {
      if (index > 4 && index < 14) {
        if (cardNumberArr[index] !== ' ') {
          cardNumberArr[index] = '*';
        }
      }
    });
    return cardNumberArr;
  };

  return (
    <div className={'card-item ' + (isCardFlipped ? '-active' : '')}>
      <div className="card-item__side -front">
        <div
          className={`card-item__focus ${currentFocusedElm ? `-active` : ``}`}
          style={style}
        />
        <div className="card-item__cover">
          <img
            alt=""
            src={`/card-background/${BACKGROUND_IMG}`}
            className="card-item__bg"
          />
        </div>
        <div className="card-item__wrapper">
          <div className="card-item__top">
            <img src={'/chip.png'} alt="" className="card-item__chip" />
            <div className="card-item__type">
              <img
                alt={useCardType}
                src={`/card-type/${useCardType}.png`}
                className="card-item__typeImg"
              />
            </div>
          </div>
          <label
            ref={cardNumberRef as LegacyRef<HTMLLabelElement>}
            className="card-item__number"
            onClick={() => onCardElementClick('cardNumber')}
          >
            <AnimatePresence>
              {cardNumber ? (
                maskCardNumber(cardNumber).map((val, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="card-item__numberItem"
                  >
                    {val}
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="card-item__numberItem"
                >
                  #
                </motion.div>
              )}
            </AnimatePresence>
          </label>
          <div className="card-item__content">
            <label
              ref={cardHolderRef as LegacyRef<HTMLLabelElement>}
              className="card-item__info"
              onClick={() => onCardElementClick('cardHolder')}
            >
              <div className="card-item__holder">Card Holder</div>
              <div className="card-item__name">
                <AnimatePresence>
                  {cardHolder === 'FULL NAME' ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      FULL NAME
                    </motion.div>
                  ) : (
                    cardHolder.split('').map((val, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="card-item__nameItem"
                      >
                        {val}
                      </motion.span>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </label>
            <div
              ref={cardDateRef as LegacyRef<HTMLDivElement>}
              className="card-item__date"
              onClick={() => onCardElementClick('cardDate')}
            >
              <label className="card-item__dateTitle">Expires</label>
              <AnimatePresence mode="wait">
                <motion.label
                  key={cardMonth}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="card-item__dateItem"
                >
                  {!cardMonth ? 'MM' : cardMonth}
                </motion.label>
              </AnimatePresence>
              /
              <AnimatePresence mode="wait">
                <motion.label
                  key={cardYear}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="card-item__dateItem"
                >
                  {!cardYear ? 'YY' : cardYear.toString().substr(-2)}
                </motion.label>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      <div className="card-item__side -back">
        <div className="card-item__cover">
          <img
            alt=""
            src={`/card-background/${BACKGROUND_IMG}`}
            className="card-item__bg"
          />
        </div>
        <div className="card-item__band" />
        <div className="card-item__cvv">
          <div className="card-item__cvvTitle">CVV</div>
          <div className="card-item__cvvBand">
            <AnimatePresence>
              {cardCvv.split('').map((val, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  *
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
          <div className="card-item__type">
            <img
              alt="card-type"
              src={'/card-type/visa.png'}
              className="card-item__typeImg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
