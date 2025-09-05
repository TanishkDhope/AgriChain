// Phone number validation (Indian format)
export const validatePhone = (phone) => {
  const phoneRegex = /^[6-9]\d{9}$/; // Indian mobile numbers start with 6-9
  return phoneRegex.test(phone);
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.toLowerCase());
};

// Aadhaar number validation
export const validateAadhaar = (aadhaar) => {
  const aadhaarRegex = /^\d{12}$/;
  return aadhaarRegex.test(aadhaar);
};

// Enhanced password validation
export const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
    errors: {
      minLength: !minLength ? "At least 8 characters required" : "",
      hasUpper: !hasUpper ? "Must contain uppercase letter" : "",
      hasLower: !hasLower ? "Must contain lowercase letter" : "",
      hasNumber: !hasNumber ? "Must contain number" : "",
      hasSpecial: !hasSpecial ? "Must contain special character" : ""
    }
  };
};

// Name validation
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

// Generic required field validation
export const validateRequired = (value, fieldName = "Field") => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return {
      isValid: false,
      error: `${fieldName} is required`
    };
  }
  return {
    isValid: true,
    error: ""
  };
};
