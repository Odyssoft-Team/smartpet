export type CardBrand = "visa" | "mastercard" | "amex" | "diners" | "unknown";

export interface CardInfo {
  brand: CardBrand;
  color: string;
  logo: string;
  displayName: string;
}

/**
 * Detecta la marca de tarjeta basado en los primeros dígitos
 */
export const detectCardBrand = (cardNumber: string): CardBrand => {
  // Remover espacios
  const cleaned = cardNumber.replace(/\s/g, "");

  // Visa: comienza con 4
  if (/^4/.test(cleaned)) {
    return "visa";
  }

  // Amex: comienza con 34 o 37
  if (/^3[47]/.test(cleaned)) {
    return "amex";
  }

  // Diners: comienza con 36, 38, o 300-305
  if (/^3(6|8|0[0-5])/.test(cleaned)) {
    return "diners";
  }

  // Mastercard: comienza con 51-55 o 2221-2720
  if (/^(5[1-5]|2[2-7])/.test(cleaned)) {
    return "mastercard";
  }

  return "unknown";
};

/**
 * Obtiene información de diseño según la marca de tarjeta
 */
export const getCardInfo = (brand: CardBrand): CardInfo => {
  const cardInfoMap: Record<CardBrand, CardInfo> = {
    visa: {
      brand: "visa",
      color: "bg-blue-600",
      logo: "💳",
      displayName: "VISA",
    },
    mastercard: {
      brand: "mastercard",
      color: "bg-red-600",
      logo: "💳",
      displayName: "MASTERCARD",
    },
    amex: {
      brand: "amex",
      color: "bg-green-700",
      logo: "💳",
      displayName: "AMEX",
    },
    diners: {
      brand: "diners",
      color: "bg-orange-600",
      logo: "💳",
      displayName: "DINERS",
    },
    unknown: {
      brand: "unknown",
      color: "bg-gray-500",
      logo: "💳",
      displayName: "TARJETA",
    },
  };

  return cardInfoMap[brand];
};

/**
 * Formatea el número de tarjeta con espacios
 */
export const formatCardNumber = (cardNumber: string): string => {
  const cleaned = cardNumber.replace(/\s/g, "");
  const brand = detectCardBrand(cleaned);

  // Amex y Diners tienen formato diferente
  if (brand === "amex") {
    // 4-6-5 para Amex
    return cleaned.replace(/(\d{4})(\d{6})(\d{5})/, "$1 $2 $3");
  }

  if (brand === "diners") {
    // 4-6-4 para Diners
    return cleaned.replace(/(\d{4})(\d{6})(\d{4})/, "$1 $2 $3");
  }

  // 4-4-4-4 para Visa y Mastercard
  return cleaned.replace(/(\d{4})(?=\d)/g, "$1 ");
};

/**
 * Valida la longitud de la tarjeta según la marca
 */
export const isValidCardLength = (cardNumber: string): boolean => {
  const cleaned = cardNumber.replace(/\s/g, "");
  const brand = detectCardBrand(cleaned);

  const lengthMap: Record<CardBrand, number[]> = {
    visa: [16],
    mastercard: [16],
    amex: [15],
    diners: [14],
    unknown: [13, 14, 15, 16, 19],
  };

  return lengthMap[brand].includes(cleaned.length);
};
