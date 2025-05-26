# Feature: Flight Search

## 🎯 Goal
Allow users to search for available flights by selecting origin, destination, and date.

## 👤 Actors
- Anonymous users
- Logged-in passengers

## 🧪 Inputs
- Origin airport code (e.g., 'JFK')
- Destination airport code (e.g., 'LAX')
- Travel date (YYYY-MM-DD)
- Optionally: roundtrip or one-way

## 📡 API
**GET** `/api/flights/search?origin=XXX&dest=YYY&date=YYYY-MM-DD`

## 📋 Flow
1. User selects origin, destination, and date on frontend.
2. Form input triggers API call to flight search endpoint.
3. Server queries `DailyFlight` collection using matching date and linked `FlightSchedule`.
4. Return matching flights with available seats and base cost.
5. Show results in table/list view.

## 🔐 Security
- Validate date format and airport codes
- Do not log full PII (e.g., IP, session info)

## 📊 Observability
- **Logs:** Search request parameters, result count, timestamp
- **Metrics:** Total searches, empty results rate, latency
- **Traces (future):** Wrap DB query and route logic in OTEL span

## ❗ Edge Cases
- No flights found
- Past date selected
- Invalid airport code
- System or DB down

## ✅ Acceptance Criteria
- Valid query returns flight list
- Empty result returns clear message
- Errors logged without exposing PII