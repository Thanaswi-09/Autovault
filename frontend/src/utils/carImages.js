export function getCategoryStyle(category) {
  const styles = {
    'Sedan':       { bg: '#DBEAFE', accent: '#2563EB', car: '#3B82F6' },
    'SUV':         { bg: '#D1FAE5', accent: '#059669', car: '#10B981' },
    'Coupe':       { bg: '#FEE2E2', accent: '#DC2626', car: '#EF4444' },
    'Truck':       { bg: '#FEF3C7', accent: '#D97706', car: '#F59E0B' },
    'Hatchback':   { bg: '#EDE9FE', accent: '#7C3AED', car: '#8B5CF6' },
    'Convertible': { bg: '#FCE7F3', accent: '#DB2777', car: '#EC4899' },
  }
  return styles[category] || styles['Sedan']
}

export function getBrandInitials(make) {
  return make.slice(0, 2).toUpperCase()
}
