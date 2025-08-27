// UI Layout constants to replace magic numbers
export const UI_CONSTANTS = {
  SIDEBAR: {
    WIDTH: 'w-80 xl:w-96',
    Z_INDEX: 'z-20',
    MOBILE_OFFSET: 'mt-16 lg:mt-0'
  },
  HEADER: {
    HEIGHT: 'h-16',
    Z_INDEX: 'z-10'
  },
  MOBILE_OVERLAY: {
    Z_INDEX: 'z-10',
    OFFSET: '-mt-16'
  },
  STATS_OVERLAY: {
    Z_INDEX: 'z-10'
  }
} as const;

// Timing constants
export const TIMING_CONSTANTS = {
  REFRESH_INTERVAL_MS: 30 * 60 * 1000, // 30 minutes
  TRANSITION_DURATION: 'duration-300'
} as const;
