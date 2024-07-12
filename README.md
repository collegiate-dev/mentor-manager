# Mentor Manager

## TODO

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

## 1.2 TODO

- [ ] add roles and middleware to protect routes (https://clerk.com/docs/references/nextjs/clerk-middleware)
- [ ] fix TS and ES Lint issues (particular in route.ts)

### Mercury Logic Improvements

- [ ] when a user fills out thier mercury details add directly to mercury and only save the mercuryId (you do not need to save all the other info)

### UI/UX Improvements

- [ ] show complete banking info as a task - do not show students until this is complete
- [ ] center sutdents matchings table
- [ ] link table row in (/students) to view of meetings info from meetings db

## V2

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
