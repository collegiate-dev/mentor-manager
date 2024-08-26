# Mentor Manager

## TODO

## V2 August 25 Hackathon Run

# Editor Functionality and Onboarding

- [ ] Editor vs microservice table (differentiate and two different tally forms)
- [ ] Create an onboarding loom and make sure all the editors are onboarded

# Counselor fixes

- [ ] After forms are completed add redirect back to dashboard
- [ ] Add toast for confirmation
- [ ] Add an alert when a counslor is trying to mark complete for a meeting that is not overdue

# Create an admin view

- [ ] Look into clerk roles (if not just add an admin yes no on mentors table)
- [ ] Admin can see a table of mentors
- [ ] When you click on a mentor (opens their page and shows their matches)

## V2

- [ ] link table row in (/students) to view of meetings info from meetings db
- [ ] (clerk roles) make an admin view where collegiate can create matches by specifying mentor, student, total meetings
- [ ] If a user is updated on clerk updating info in db
- [ ] Handle international onboarding for mercury
- [ ] If tally form is submitted redirect back to the dashboard

# Onboarding Instructions

I am writing this out for initial testing purposes there should be a guided onboarding as there may be errors:

1. Mentor Signs Up With Clerk
2. Ensure that they are added to the mentors db in vercel-postgres under the mentors table
3. Have them fill out the tally for mercury onboarding
4. Ensure that the info is in vercel-postgres

## V0

- [x] make it deploy (vercel)
- [x] scaffold basic UI
- [x] tidy up build
- [x] set up a database (vercel postgres)
- [x] add authentication (clerk)
- [x] create endpoints for database
- [x] create button to submit tally
- [x] increase meeting count by 1 when tally is submitted
- [x] create mentors db and add clerkid and name when a user signs up

## 1.1 TODO

- [x] add receipient to mercury
- [x] stage payment in mercury

## 1.11 Launch TODOS Counselors

- [x] add studnets into database
- [x] create a way to manage when meetings are supposed to be (Dates and Frequency)

## 1.2 TODO

- [x] fix TS and ES Lint issues (particular in route.ts)

### Mercury Logic Improvements

- [x] when a user fills out thier mercury details add directly to mercury and only save the mercuryId (you do not need to save all the other info)

### UI/UX Improvements

- [x] show complete banking info as a task - do not show students until this is complete
- [x] center sutdents matchings table

## Agrim Feedback

- [x] On tally show the type (PM, counselor, editor, am, etc)
- [x] Mercury memo (Student Name, Service Provided (PM, counselor, editor, application info), Meeting MEETING NUMBER (if meeting))
