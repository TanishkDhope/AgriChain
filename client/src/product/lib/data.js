export const productData = {
  name: "Tomatoes",
  farm: "Green Valley Organic Farm, Nashik",
  fairPrice: { farmer: 20, retail: 45 },
  info: {
    lotId: "LOT12345",
    farmId: "FARM-Nashik-001",
    quantity: "500 kg",
    grade: "Premium A+",
    description: "Premium organic tomatoes grown using sustainable farming practices."
  },
  certification: {
    title: "Certified Organic",
    details: "FSSAI certified organic farming practices with zero pesticide residue."
  }
};

export const timelineData = [
  {
    id: 1,
    title: "Farmer",
    icon: "🌾",
    date: "02 Sep 2025",
    location: "Nashik, Maharashtra",
    basicInfo: {
      "📅 Date": "02 Sep 2025 (Harvest date)",
      "📍 Location": "Nashik, Maharashtra",
      "👤 Farmer Name": "Ramesh Kumar"
    },
    detailedInfo: {
      "📦 Quantity": "500 kg",
      "💰 Price": "₹20/kg",
      "🔗 Lot ID": "LOT12345",
      "🔗 Blockchain Hash": "0xabc123..."
    }
  },
  {
    id: 2,
    title: "Distributor", 
    icon: "🚚",
    date: "03 Sep 2025",
    location: "Nashik → Mumbai",
    basicInfo: {
      "📅 Date": "03 Sep 2025 (Dispatch date)",
      "📍 Route": "Nashik → Mumbai",
      "👤 Distributor Name": "FreshLogistics Pvt. Ltd."
    },
    detailedInfo: {
      "📦 Quantity": "500 kg, cold storage",
      "💰 Transport Cost": "₹5/kg",
      "🌡️ Storage Method": "Cold Chain",
      "🔗 Blockchain Hash": "0xdef456..."
    }
  },
  {
    id: 3,
    title: "Market",
    icon: "🏬", 
    date: "04 Sep 2025",
    location: "Vashi APMC Market, Mumbai",
    basicInfo: {
      "📅 Date": "04 Sep 2025 (Arrival at APMC)",
      "📍 Location": "Vashi APMC Market, Mumbai",
      "👤 Market Trader Name": "AgriTrade Ltd."
    },
    detailedInfo: {
      "📦 Quantity": "490 kg, 10 kg lost in handling",
      "💰 Price": "₹30/kg wholesale rate",
      "📊 Loss %": "2% during handling",
      "🔗 Blockchain Hash": "0xghi789..."
    }
  },
  {
    id: 4,
    title: "Retailer",
    icon: "🏪",
    date: "05 Sep 2025", 
    location: "Andheri, Mumbai",
    basicInfo: {
      "📅 Date": "05 Sep 2025 (Arrival at store)",
      "📍 Location": "Andheri, Mumbai", 
      "👤 Retailer Name": "BigMart Mumbai"
    },
    detailedInfo: {
      "📦 Quantity": "480 kg after losses",
      "💰 Price": "₹45/kg retail rate",
      "📄 Contract Price": "₹35/kg (to distributor)",
      "🔗 Blockchain Hash": "0xjkl012..."
    }
  }
];

export const reviewsData = [
  {
    id: 1,
    name: "Priya Sharma",
    rating: 5,
    date: "06 Sep 2025",
    review: "Amazing quality tomatoes! The traceability feature gives me complete confidence in what I'm buying."
  },
  {
    id: 2,
    name: "Amit Patel",
    rating: 5,
    date: "05 Sep 2025",
    review: "Love the transparency! Being able to track from farm to store is incredible. Fresh and tasty."
  },
  {
    id: 3,
    name: "Sunita Desai",
    rating: 4,
    date: "05 Sep 2025",
    review: "Great initiative! The blockchain tracking shows the complete journey. Quality is excellent."
  }
];
