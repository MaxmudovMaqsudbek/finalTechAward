// src/shared/lib/utils/index.js
export const formatNumber = (value, locale = 'uk-UA') => {
  if (typeof value === 'string' && value.includes(',')) {
    return value;
  }
  return new Intl.NumberFormat(locale).format(value);
};

export const formatCurrency = (value, currency = 'UAH', locale = 'uk-UA') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (date, locale = 'uk-UA') => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(date);
};

export const getMapColor = (density) => {
  if (density > 70) return '#1e40af';
  if (density > 50) return '#3B82F6';
  if (density > 30) return '#60A5FA';
  return '#93BBFB';
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};