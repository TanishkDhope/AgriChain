export const validatePhone = (phone) => /^\d{10}$/.test(phone);
export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
export const validateAadhaar = (aadhaar) => /^\d{12}$/.test(aadhaar);
