const MaskedCard = ({
  cardNumber,
  visibleDigits = 4,
}: {
  cardNumber?: string;
  visibleDigits?: number;
}) => {
  const formatCardNumber = () => {
    if (!cardNumber) return "____ ____ ____ ____";

    const cleaned = cardNumber.replace(/\s/g, "");
    const firstTwo = cleaned.slice(0, 2);
    const lastFour = cleaned.slice(-visibleDigits);
    const middlePart = cleaned.slice(2, -visibleDigits).replace(/\d/g, "_");

    const combined = firstTwo + middlePart + lastFour;
    return combined.replace(/(.{4})/g, "$1 ").trim();
  };

  return <span>{formatCardNumber()}</span>;
};

export default MaskedCard;
