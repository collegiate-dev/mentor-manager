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
- [ ] create mentors db and add clerkid and name when a user signs up
- [ ] add roles and middleware to protect routes (https://clerk.com/docs/references/nextjs/clerk-middleware)
- [ ] (clerk roles) make an admin view where collegiate can create matches by specifying mentor, student, total meetings

## 1.1 TODO

- [ ] update payroll form or stage in mercury
- [ ] link table row in (/students) to view of meetings info from meetings db

## V2

- [ ] If a user is updated on clerk updating info in db
- [ ] Handle international onboarding for mercury

# Onboarding Instructions

I am writing this out for initial testing purposes there should be a guided onboarding as there may be errors:

1. Mentor Signs Up With Clerk
2. Ensure that they are added to the mentors db in vercel-postgres under the mentors table
3. Have them fill out the tally for mercury onboarding
4. Ensure that the info is in vercel-postgres
