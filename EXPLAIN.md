# How a booking is created, from click to database

This walks through what happens when a customer clicks **Book** on a chef's slot.

## 1. Chef page: picking a slot

`frontend/src/pages/ChefDetails.jsx`

- On load it calls `getChef(id)` from `frontend/src/api/chefs.js`, which sends `GET /api/chefs/{id}`.
- The backend returns the chef, the menu and the open future slots (`ChefService.getChefDetails`).
- Clicking **Book** runs `navigate('/book/:chefId/:slotId')`.

## 2. Route guard

`frontend/src/App.jsx` and `frontend/src/routes/ProtectedRoute.jsx`

- `/book/...` is wrapped in `<ProtectedRoute roles={['CUSTOMER']} />`.
- `ProtectedRoute` reads `user` from `AuthContext` (`frontend/src/context/AuthContext.jsx`).
- If nobody is logged in, it redirects to `/login` and remembers `from`, so after login the user comes back to the booking page.

## 3. Booking form

`frontend/src/pages/Booking.jsx`

- It loads the chef again and finds the chosen slot, so it can show the summary card.
- On submit it calls `createBooking({ slotId, address, guestCount, notes })` from `frontend/src/api/bookings.js`.

## 4. Axios client

`frontend/src/api/client.js`

- `baseURL` comes from `VITE_API_URL`.
- A request interceptor adds `Authorization: Bearer <token>`, using the token from localStorage that was saved at login.
- The request is sent as `POST /api/bookings`.

## 5. Security filter chain

`backend/src/main/java/com/chefhub/security/JwtAuthFilter.java`

- It reads the Bearer token and checks it with `JwtService.isValid`.
- It loads the user via `CustomUserDetailsService`, which gives the authority `ROLE_CUSTOMER`.
- It puts the authentication into the `SecurityContext`.

`backend/src/main/java/com/chefhub/config/SecurityConfig.java`

- `/api/bookings/**` requires `hasRole("CUSTOMER")`, otherwise it returns 401 or 403 JSON.

## 6. Controller

`backend/src/main/java/com/chefhub/controller/BookingController.java`

- `create(Principal principal, @Valid @RequestBody BookingRequest request)`
- `@Valid` checks `BookingRequest` (`dto/BookingRequest.java`): slotId must be present, address can't be blank, and guestCount must be 1 to 50.
- If validation fails, `GlobalExceptionHandler` returns 400 with field errors.
- It passes `principal.getName()` (the email) to the service.

## 7. Service: the business rules

`backend/src/main/java/com/chefhub/service/BookingService.java`, `createBooking(...)`, annotated `@Transactional`

1. It finds the customer by email (`UserRepository.findByEmail`).
2. It loads the slot with `AvailabilitySlotRepository.findByIdForUpdate`. This is a `PESSIMISTIC_WRITE` lock, so MySQL runs `SELECT ... FOR UPDATE`. A second request for the same slot waits here until the first transaction finishes.
3. It checks that the chef is approved and the slot is not in the past.
4. It checks the slot is not already taken: `slot.isBooked()` or `BookingRepository.existsBySlotIdAndStatusIn(slotId, PENDING/CONFIRMED)`. If either is true, it throws `BadRequestException` and the user gets a 400 "slot was just booked".
5. It sets `slot.booked = true` and builds a `Booking` with status `PENDING` and `totalPrice` set to the chef's price per visit.
6. It saves the booking with `bookingRepository.save(booking)`.

## 8. Database

When the transaction commits, Hibernate runs:

- `UPDATE availability_slots SET booked = true WHERE id = ?`
- `INSERT INTO bookings (customer_id, chef_id, slot_id, address, guest_count, notes, total_price, status, created_at) VALUES (...)`

The lock is released after the commit. If something fails, both changes are rolled back together.

## 9. Response back to the UI

- The service maps the entity to `BookingResponse.from(booking)` (`dto/BookingResponse.java`), so no entity leaves the API.
- The controller returns `201 Created` with JSON.
- `Booking.jsx` navigates to `/my-bookings` with `state.justBooked`.
- `MyBookings.jsx` shows the success message and loads `GET /api/bookings/my`.

## What happens next

- The chef sees the request in `components/chef/IncomingBookings.jsx` and clicks **Accept**. That sends `PATCH /api/chef/bookings/{id}/status`, handled by `BookingService.updateStatusByChef`, which checks the `CHEF_TRANSITIONS` map.
- If the chef rejects the booking or the customer cancels it, `slot.booked` goes back to `false`, so the slot can be booked again.
