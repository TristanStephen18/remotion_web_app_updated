// server/routes/projects.ts
import type { Response } from "express";
import { Router } from "express";
import { eq, and } from "drizzle-orm";
import type { AuthRequest } from "../../utils/authmiddleware.ts";

import { requireAuth } from "../../utils/authmiddleware.ts";
import { projects } from "../../db/schema.ts";
import { db } from "../../db/client.ts";

const router = Router();

// Save new project
router.post("/save", requireAuth, async (req: AuthRequest, res: Response) => {
  const { title, templateId, props, projectVidUrl } = req.body;
  const userId = req.user?.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!title || !templateId || !props) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Check duplicate name
  const existing = await db
    .select()
    .from(projects)
    .where(and(eq(projects.userId, userId), eq(projects.title, title)));

  if (existing.length > 0) {
    return res.status(400).json({ error: "Project name already exists." });
  }

  // Insert new project with optional projectVidUrl
  const [newProject] = await db
    .insert(projects)
    .values({ userId, title, templateId, props, projectVidUrl })
    .returning();

  res.json({ message: "Project saved successfully", project: newProject });
});

// Update existing project
router.put(
  "/update/:id",
  requireAuth,
  async (req: AuthRequest, res: Response) => {
    const { id } = req.params;
    const { props, projectVidUrl } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const [existing] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.userId, userId), eq(projects.id, Number(id))));

    if (!existing) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Update props and/or video url
    const [updated] = await db
      .update(projects)
      .set({ props, projectVidUrl })
      .where(eq(projects.id, Number(id)))
      .returning();

    res.json({ message: "Project updated successfully", project: updated });
  }
);

export default router;
