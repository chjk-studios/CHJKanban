import { Hono } from 'hono'
import { statements } from "../utils/db.js";

const columns = new Hono()

columns.post("/:boardId", async (c) => {
  const boardId = c.req.param("boardId");
  const { name, position, type } = await c.req.json();

  const columnId = crypto.randomUUID();

  const col = statements.columnInsert.get(
    columnId,
    boardId,
    name,
    position,
    type
  );

  return c.json(col);
});

columns.get("/:id", (c) => {
  const id = c.req.param("id");

  const board = statements.boardById.get(id);
  const columns = statements.columnsByBoard.all(id);

  return c.json({ board, columns });
});

columns.delete("/:id", (c) => {
  const id = c.req.param("id");

  const deleted = statements.columnDelete.get(id);

  if (!deleted) {
    return c.json({ error: "Column not found." }, 404);
  }

  return c.json({ message: "Column deleted successfully." });
});

export default columns;