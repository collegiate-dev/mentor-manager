import { integer, jsonb, serial, varchar, date } from "drizzle-orm/pg-core";
import { pgTableCreator, index } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `mentor_manager_${name}`);

// Mentors table
export const mentors = createTable(
  "mentors",
  {
    id: varchar("id", { length: 256 }).primaryKey(),
    email: varchar("email", { length: 256 }),
    firstname: varchar("firstname", { length: 256 }),
    lastname: varchar("lastname", { length: 256 }),
    paymentMethod: varchar("paymentMethod", { length: 50 }),
    mercuryId: varchar("mercuryId", { length: 256 }),
    phoneNumber: jsonb("phoneNumber"),
  },
  (example) => ({
    emailIndex: index("email_idx").on(example.email),
  }),
);

// Students table
export const students = createTable(
  "students",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
  },
  (example) => ({
    nameIndex: index("name_idx").on(example.name),
  }),
);

// Matches table
export const matches = createTable(
  "matches",
  {
    id: serial("id").primaryKey(),
    mentorId: varchar("mentorId", { length: 256 })
      .notNull()
      .references(() => mentors.id),
    studentId: integer("studentId")
      .notNull()
      .references(() => students.id),
    totalMeetings: integer("totalMeetings").notNull(),
    meetingsCompleted: integer("meetingsCompleted").notNull(),
    frequency: integer("frequency").notNull(),
    compensation: integer("compensation"),
  },
  (example) => ({
    mentorIdIndex: index("applications_mentorId_idx").on(example.mentorId),
    studentIdIndex: index("applications_studentId_idx").on(example.studentId),
  }),
);

// Meetings table
export const meetings = createTable(
  "meetings",
  {
    id: serial("id").primaryKey(),
    matchId: integer("matchId")
      .notNull()
      .references(() => matches.id),
    estimatedTime: integer("estimatedTime").notNull(),
    meetingNotes: varchar("meetingNotes", { length: 1000 }).notNull(),
    meetingDate: date("meetingDate").notNull(),
  },
  (example) => ({
    matchIdIndex: index("matchId_idx").on(example.matchId),
  }),
);

// Applications table
export const applications = createTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    name: varchar("name").notNull(),
    mentorId: varchar("mentorId", { length: 256 })
      .notNull()
      .references(() => mentors.id),
    studentId: integer("studentId")
      .notNull()
      .references(() => students.id),
    type: varchar("type").notNull(),
    compensation: integer("compensation").notNull(),
  },
  (example) => ({
    mentorIdIndex: index("mentorId_idx").on(example.mentorId),
    studentIdIndex: index("studentId_idx").on(example.studentId),
  }),
);
