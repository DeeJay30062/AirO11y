const flightSchedules = [
  {
    flightNumber: 'DL101',
    origin: 'JFK',
    destination: 'LAX',
    daysOfWeek: ['M', 'W', 'F'],
    departureTime: '09:00',
    durationMinutes: 360,
    seatConfig: { first: 8, economyPlus: 16, coach: 120 },
  },
  {
    flightNumber: 'AA202',
    origin: 'SFO',
    destination: 'ORD',
    daysOfWeek: ['T', 'Th', 'Sa'],
    departureTime: '13:45',
    durationMinutes: 270,
    seatConfig: { first: 6, economyPlus: 12, coach: 100 },
  },
  {
    flightNumber: 'UA303',
    origin: 'ATL',
    destination: 'SEA',
    daysOfWeek: ['Su', 'T', 'F'],
    departureTime: '16:30',
    durationMinutes: 310,
    seatConfig: { first: 10, economyPlus: 20, coach: 110 },
  },
];

export default flightSchedules;
