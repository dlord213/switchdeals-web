export interface CountryCurrency {
  value: string;
  currency: string;
  symbol: string;
}

const countries: { [key: string]: CountryCurrency } = {
  Argentina: { value: "ar", currency: "ARS", symbol: "$" },
  Australia: { value: "au", currency: "AUD", symbol: "$" },
  Austria: { value: "at", currency: "EUR", symbol: "€" },
  Belgium: { value: "be", currency: "EUR", symbol: "€" },
  Brazil: { value: "br", currency: "BRL", symbol: "R$" },
  Bulgaria: { value: "bg", currency: "EUR", symbol: "€" },
  Canada: { value: "ca", currency: "CAD", symbol: "$" },
  Chile: { value: "cl", currency: "CLP", symbol: "$" },
  Colombia: { value: "co", currency: "COP", symbol: "$" },
  Croatia: { value: "hr", currency: "EUR", symbol: "€" },
  Cyprus: { value: "cy", currency: "EUR", symbol: "€" },
  "Czech Republic": { value: "cz", currency: "CZK", symbol: "Kč" },
  Denmark: { value: "dk", currency: "DKK", symbol: "kr." },
  Estonia: { value: "ee", currency: "EUR", symbol: "€" },
  Finland: { value: "fi", currency: "EUR", symbol: "€" },
  France: { value: "fr", currency: "EUR", symbol: "€" },
  Germany: { value: "de", currency: "EUR", symbol: "€" },
  Greece: { value: "gr", currency: "EUR", symbol: "€" },
  Hungary: { value: "hu", currency: "EUR", symbol: "€" },
  Ireland: { value: "ie", currency: "EUR", symbol: "€" },
  Italy: { value: "it", currency: "EUR", symbol: "€" },
  Japan: { value: "jp", currency: "JPY", symbol: "¥" },
  Latvia: { value: "lv", currency: "EUR", symbol: "€" },
  Lithuania: { value: "lt", currency: "EUR", symbol: "€" },
  Luxembourg: { value: "lu", currency: "EUR", symbol: "€" },
  Malta: { value: "mt", currency: "EUR", symbol: "€" },
  Mexico: { value: "mx", currency: "MXN", symbol: "$" },
  Netherlands: { value: "nl", currency: "EUR", symbol: "€" },
  "New Zealand": { value: "nz", currency: "NZD", symbol: "$" },
  Norway: { value: "no", currency: "NOK", symbol: "kr" },
  Peru: { value: "pe", currency: "PEN", symbol: "S/" },
  Poland: { value: "pl", currency: "PLN", symbol: "zł" },
  Portugal: { value: "pt", currency: "EUR", symbol: "€" },
  Romania: { value: "ro", currency: "EUR", symbol: "€" },
  Slovakia: { value: "sk", currency: "EUR", symbol: "€" },
  Slovenia: { value: "si", currency: "EUR", symbol: "€" },
  "South Africa": { value: "za", currency: "ZAR", symbol: "R" },
  Spain: { value: "es", currency: "EUR", symbol: "€" },
  Sweden: { value: "se", currency: "SEK", symbol: "kr" },
  Switzerland: { value: "ch", currency: "CHF", symbol: "CHF" },
  "United Kingdom": { value: "gb", currency: "GBP", symbol: "£" },
  "United States": { value: "us", currency: "USD", symbol: "$" },
};

export default countries;
