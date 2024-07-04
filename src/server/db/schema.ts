import { integer, serial, varchar } from "drizzle-orm/pg-core";
import { pgTableCreator, index, foreignKey } from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `mentor_manager_${name}`);

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
    mentorId: varchar("mentorId", { length: 256 }),
    studentId: integer("studentId")
      .notNull()
      .references(() => students.id),
    totalMeetings: integer("totalMeetings"),
    meetingsCompleted: integer("meetingsCompleted"),
  },
  (example) => ({
    mentorIdIndex: index("mentorId_idx").on(example.mentorId),
    studentIdIndex: index("studentId_idx").on(example.studentId),
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
    estimatedTime: integer("estimatedTime"),
    meetingNotes: varchar("meetingNotes", { length: 1000 }),
  },
  (example) => ({
    matchIdIndex: index("matchId_idx").on(example.matchId),
  }),
);
