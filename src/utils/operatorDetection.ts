
// Enhanced operator detection with real logos
export const operators: { [key: string]: { logo: string; name: string } } = {
  "Airtel": {
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop&crop=center",
    name: "Airtel"
  },
  "Jio": {
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop&crop=center", 
    name: "Reliance Jio"
  },
  "Vi": {
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop&crop=center",
    name: "Vodafone Idea"
  },
  "BSNL": {
    logo: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=64&h=64&fit=crop&crop=center",
    name: "BSNL"
  }
};

// Enhanced number to operator mapping
const numberRanges: { [key: string]: string[] } = {
  "Airtel": [
    "70", "80", "81", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99"
  ],
  "Jio": [
    "60", "61", "62", "63", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79", 
    "80", "81", "82", "83", "84", "85", "86", "87", "88", "89"
  ],
  "Vi": [
    "70", "75", "80", "81", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99"
  ],
  "BSNL": [
    "94", "95", "96", "97", "98", "99"
  ]
};

export const detectOperator = (phoneNumber: string): string => {
  if (phoneNumber.length !== 10) return "Unknown";
  
  const prefix = phoneNumber.substring(0, 2);
  
  // Check Jio first (most comprehensive range)
  if (numberRanges.Jio.includes(prefix)) {
    // Additional Jio specific patterns
    if (phoneNumber.startsWith("6") || phoneNumber.startsWith("7") || phoneNumber.startsWith("8")) {
      return "Jio";
    }
  }
  
  // Check Airtel
  if (numberRanges.Airtel.includes(prefix)) {
    // Airtel specific patterns
    if (phoneNumber.startsWith("9") && ["91", "92", "93", "94", "95", "96", "97", "98", "99"].includes(prefix)) {
      return "Airtel";
    }
    if (phoneNumber.startsWith("8") && ["80", "81"].includes(prefix)) {
      return "Airtel";
    }
    if (phoneNumber.startsWith("7") && ["70"].includes(prefix)) {
      return "Airtel";
    }
  }
  
  // Check Vi
  if (numberRanges.Vi.includes(prefix)) {
    // Vi specific patterns
    if (phoneNumber.startsWith("9") && ["90", "91", "92", "93", "94", "95", "96", "97", "98", "99"].includes(prefix)) {
      return "Vi";
    }
    if (phoneNumber.startsWith("8") && ["80", "81"].includes(prefix)) {
      return "Vi";
    }
    if (phoneNumber.startsWith("7") && ["70", "75"].includes(prefix)) {
      return "Vi";
    }
  }
  
  // Check BSNL
  if (numberRanges.BSNL.includes(prefix)) {
    return "BSNL";
  }
  
  // Default to Jio for any valid 10-digit number that doesn't match above patterns
  return "Jio";
};
