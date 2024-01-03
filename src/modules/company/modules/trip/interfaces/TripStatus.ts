import Trip from './trip'

export type TripProblemStatus = 'break' | 'off_service' | 'sleeping'

export type TripStatus =
  | 'wait_driver'
  | 'wait_load'
  | 'loaded'
  | 'wait_unload'
  | 'unloaded'
  | 'finish'
  | TripProblemStatus

export function nextStatus(trip: Trip): TripStatus {
  switch (trip.status) {
    case 'wait_driver':
      return 'wait_load'
    case 'wait_load':
      return 'loaded'
    case 'loaded':
      return 'wait_unload'
    case 'wait_unload':
      return 'unloaded'
    case 'unloaded':
      return 'finish'
    case 'finish':
      return 'finish'
    case 'break':
      return trip.before_status!
    case 'off_service':
      return trip.before_status!
    case 'sleeping':
      return trip.before_status!
  }
}
