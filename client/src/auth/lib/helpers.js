export const formatPhone = (phone) => phone.replace(/\D/g, "").slice(0, 10);
export const formatAadhaar = (aadhaar) => aadhaar.replace(/\D/g, "").slice(0, 12);
