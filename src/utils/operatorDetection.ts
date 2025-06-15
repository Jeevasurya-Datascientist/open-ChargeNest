export const operators: { [key: string]: { prefixes: string[], logo: string } } = {
  "Airtel": {
    prefixes: ["98", "99", "70", "96", "78", "80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95"],
    logo: "/logos/airtel.png"
  },
  "Jio": {
    prefixes: ["60", "61", "62", "63", "64", "65", "66", "67", "68", "69", "70", "71", "72", "73", "74", "75", "76", "77", "78", "79"],
    logo: "/logos/jio.png"
  },
  "Vi": {
    prefixes: ["80", "81", "82", "83", "84", "85", "86", "87", "88", "89", "90", "91", "92", "93", "94", "95", "96", "97", "98", "99"],
    logo: "/logos/vi.png"
  },
  "BSNL": {
    prefixes: ["62", "63", "64", "65", "66", "67", "68", "69", "94", "95", "96", "97", "98", "99"],
    logo: "/logos/bsnl.png"
  }
};

export const billerLogos: { [key: string]: string } = {
  // DTH Providers
  "Tata Sky": "/logos/tata-sky.png",
  "Dish TV": "/logos/dish-tv.png",
  "Airtel Digital TV": "/logos/airtel-dth.png",
  "Sun Direct": "/logos/sun-direct.png",
  "D2H": "/logos/d2h.png",
  
  // Electricity Boards
  "MSEB": "/logos/mseb.png",
  "BESCOM": "/logos/bescom.png",
  "TNEB": "/logos/tneb.png",
  "PSEB": "/logos/pseb.png",
  "UPPCL": "/logos/uppcl.png",
  "KESC": "/logos/kesc.png",
  "WBSEDCL": "/logos/wbsedcl.png",
  "KSEB": "/logos/kseb.png",
  "GSECL": "/logos/gsecl.png",
  "RSEB": "/logos/rseb.png",
  
  // Gas Providers
  "Indane": "/logos/indane.png",
  "Bharat Gas": "/logos/bharat-gas.png",
  "HP Gas": "/logos/hp-gas.png",
  
  // Broadband
  "Jio Fiber": "/logos/jio-fiber.png",
  "ACT": "/logos/act.png",
  "BSNL": "/logos/bsnl-broadband.png"
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
