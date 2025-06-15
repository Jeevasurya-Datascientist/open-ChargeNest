
export const operators: { [key: string]: { prefixes: string[], logo: string } } = {
  "Airtel": {
    prefixes: ["98", "99", "70", "96", "78", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95"],
    logo: "https://cdn.worldvectorlogo.com/logos/bharti-airtel-1.svg"
  },
  "Jio": {
    prefixes: ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79"],
    logo: "https://cdn.worldvectorlogo.com/logos/reliance-jio-logo.svg"
  },
  "Vi": {
    prefixes: ["80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99"],
    logo: "https://cdn.worldvectorlogo.com/logos/vodafone-idea-vi-logo.svg"
  },
  "BSNL": {
    prefixes: ["62", "63", "64", "65", "66", "67", "68", "69", "94", "95", "96", "97", "98", "99"],
    logo: "https://logos-world.net/wp-content/uploads/2023/01/BSNL-Logo.png"
  }
};

export const detectOperator = (phoneNumber: string): string => {
  if (!phoneNumber || phoneNumber.length < 10) return "Unknown";
  
  const prefix = phoneNumber.substring(0, 2);
  
  // Jio detection
  if (["60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79"].includes(prefix)) {
    return "Jio";
  }
  
  // Airtel detection
  if (["98", "99", "70", "96", "78", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95"].includes(prefix)) {
    return "Airtel";
  }
  
  // Vi detection (Vodafone Idea)
  if (["80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99"].includes(prefix)) {
    return "Vi";
  }
  
  // BSNL detection
  if (["62", "63", "64", "65", "66", "67", "68", "69", "94", "95", "96", "97", "98", "99"].includes(prefix)) {
    return "BSNL";
  }
  
  // Default based on most common patterns
  if (phoneNumber.startsWith("860")) return "Jio";
  if (phoneNumber.startsWith("98")) return "Airtel";
  if (phoneNumber.startsWith("90")) return "Vi";
  if (phoneNumber.startsWith("94")) return "BSNL";
  
  return "Jio"; // Default to Jio for any valid 10-digit number
};
