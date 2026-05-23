import { Hono } from 'hono'
import { statements } from "../utils/db.js";

const cards = new Hono()

cards.post("/:columnId", async (c) => {
  const columnId = c.req.param("columnId");
  const { title, description, position } = await c.req.json();

  const card = statements.cardInsert.get(
    columnId,
    title,
    description,
    position
  );

  return c.json(card);
});

cards.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const { columnId, position } = await c.req.json();

  const updated = statements.cardUpdate.get(columnId, position, id);

  return c.json(updated);
});

export default cards;