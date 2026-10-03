# Security Specification: Smart Crop Advisory System

## 1. Data Invariants
1. **User Profile Invariant**: A user's profile at `/users/{userId}` can ONLY be read or written by the authenticated user whose `request.auth.uid == userId`. No user can read or modify another user's personal profile (PII protection: phone, name, email, farm landholding).
2. **Subcollection Master Gate**: Subcollections under `/users/{userId}/*` (`irrigation`, `crop_tasks`, `crop_notes`) strictly require `request.auth.uid == userId`. Any attempt to access another user's subcollections is rejected immediately.
3. **Identity Spoofing Guard**: In `crop_tasks`, `crop_notes`, and `irrigation`, any author or ownership UID field (`userId`) must strictly match `request.auth.uid`.
4. **Disease Alerts Invariant**: Outbreak alerts under `/alerts/{alertId}` can be read by any authenticated or public farmer for early warning and epidemic containment, but creation requires authenticated user (`request.auth.uid != null`), and updating/deleting verified alerts is reserved for the author or officer (`isVerifiedByOfficer` cannot be forged by regular users).
5. **Path ID Hardening**: Document IDs must conform to `^[a-zA-Z0-9_\-]+$` and have length `<= 128`.
6. **Bounded Sizes**: All string properties have explicit maximum lengths to prevent resource exhaustion and Denial of Wallet attacks.

## 2. The Dirty Dozen Payloads (Adversarial Security Test Cases)

1. **Payload 1 (PII Blanket Snoop)**: User A requests `GET /users/userB`.
   - *Expected*: `PERMISSION_DENIED`.
2. **Payload 2 (Subcollection Hijack)**: User A attempts `WRITE /users/userB/irrigation/state` with `{ isPumpOn: true }`.
   - *Expected*: `PERMISSION_DENIED`.
3. **Payload 3 (Identity Spoofing on Task)**: User A writes to `/users/userA/crop_tasks/task1` with `{ userId: 'userB' }`.
   - *Expected*: `PERMISSION_DENIED` (userId must equal auth.uid).
4. **Payload 4 (Ghost Field Injection)**: User A writes to `/users/userA` with `{ name: 'Farmer', isAdmin: true, bypassRules: true }`.
   - *Expected*: `PERMISSION_DENIED` (keys must match schema allowlist).
5. **Payload 5 (Unauthenticated Profile Write)**: Anonymous client attempts `WRITE /users/user123` with valid profile data without an auth token.
   - *Expected*: `PERMISSION_DENIED`.
6. **Payload 6 (Oversized Payload / Denial of Wallet)**: User A sends a 1MB string in `name` to `/users/userA`.
   - *Expected*: `PERMISSION_DENIED` (name length must be <= 100).
7. **Payload 7 (Path Variable Poisoning)**: Write to `/users/../admin/hacked` or with invalid characters in doc ID.
   - *Expected*: `PERMISSION_DENIED` (isValidId regex constraint).
8. **Payload 8 (State Tampering - Verified Flag)**: Non-admin user creates or updates an alert with `isVerifiedByOfficer: true`.
   - *Expected*: `PERMISSION_DENIED`.
9. **Payload 9 (Unauthorized Delete)**: User A attempts `DELETE /users/userB/crop_notes/note1`.
   - *Expected*: `PERMISSION_DENIED`.
10. **Payload 10 (Irrigation Status Corruption)**: User writes `{ mode: 'invalid_mode_injection' }` into irrigation state.
    - *Expected*: `PERMISSION_DENIED` (enum validation `['auto', 'manual']`).
11. **Payload 11 (Task Text Overflow)**: User writes task with `textEn` of 10,000 characters.
    - *Expected*: `PERMISSION_DENIED` (max 300 characters).
12. **Payload 12 (Direct Root Collection Listing)**: Unauthenticated query attempting to list all `/users` documents without constraint.
    - *Expected*: `PERMISSION_DENIED` (users collection is default-deny for list).
