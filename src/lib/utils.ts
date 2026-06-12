import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper for currency formatting
export function formatCurrency(value: number, locale?: string): string {
  const isBn = locale ? locale === 'bn' : (typeof window !== 'undefined' && localStorage.getItem('farmly_locale_v3') === 'bn');
  if (isBn) {
    let roundedValue = value * 120;
    if (value === 49) roundedValue = 5000;
    else if (value === 99) roundedValue = 10000;
    else if (value === 199) roundedValue = 20000;
    
    return `৳${new Intl.NumberFormat('bn-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(roundedValue)}`;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Helper for dates
export function formatDate(dateString: string, locale?: string): string {
  if (!dateString) return '';
  const date = new Date(dateString);
  const isBn = locale ? locale === 'bn' : (typeof window !== 'undefined' && localStorage.getItem('farmly_locale_v3') === 'bn');
  return date.toLocaleDateString(isBn ? 'bn-BD' : 'en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
