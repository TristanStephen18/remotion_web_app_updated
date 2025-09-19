import { pgTable, serial, text, timestamp, integer, jsonb, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  passwordHash: text("password_hash"), // nullable because socials don’t use it
  provider: text("provider"),          // "google" | "github" | "twitter" | null
  providerId: text("provider_id"),     // ID from provider (sub, user_id, etc.)
  createdAt: timestamp("created_at").defaultNow().notNull(),
});


// Templates
export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  // JSON schema of props (so UI can auto-generate editors)
  propsSchema: jsonb("props_schema").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Projects (user customized templates)
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  templateId: integer("template_id").references(() => templates.id).notNull(),
  title: text("title").notNull(),
  props: jsonb("props").notNull(), // stores customized props
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Render Jobs
export const renders = pgTable("renders", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: integer("project_id").references(() => projects.id).notNull(),
  status: text("status").$type<"queued" | "processing" | "done" | "failed">().default("queued").notNull(),
  outputUrl: text("output_url"), // link to final video
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
