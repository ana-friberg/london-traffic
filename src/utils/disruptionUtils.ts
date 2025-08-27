// Shared utilities for disruption display
export const getSeverityConfig = (severity: string) => {
  switch (severity) {
    case 'Severe':
      return {
        bgColor: 'bg-red-100 hover:bg-red-200 border-red-200',
        textColor: 'text-red-800',
        badgeColor: 'bg-red-500',
        mapColor: '#dc2626'
      };
    case 'Moderate':
      return {
        bgColor: 'bg-orange-100 hover:bg-orange-200 border-orange-200',
        textColor: 'text-orange-800',
        badgeColor: 'bg-orange-500',
        mapColor: '#ea580c',
      };
    case 'Minor':
      return {
        bgColor: 'bg-yellow-100 hover:bg-yellow-200 border-yellow-200',
        textColor: 'text-yellow-800',
        badgeColor: 'bg-yellow-500',
        mapColor: '#eab308'
      };
    default:
      return {
        bgColor: 'bg-gray-100 hover:bg-gray-200 border-gray-200',
        textColor: 'text-gray-800',
        badgeColor: 'bg-gray-500',
        mapColor: '#6b7280',
        icon: 'ℹ️'
      };
  }
};

export const formatStatus = (status: string): string => {
  switch (status) {
    case 'Active':
      return 'Currently Active';
    case 'Inactive':
      return 'Resolved';
    default:
      return status;
  }
};

export const formatCoordinates = (coordinates: [number, number]): string => {
  const [longitude, latitude] = coordinates;
  return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
};
