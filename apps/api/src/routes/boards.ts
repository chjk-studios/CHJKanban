import { Hono } from 'hono'
import { statements } from "../utils/db.js";

type Column = {
    id: string;
    board_id: string;
    name: string;
    position: number;
};

type Card = {
    id: string;
    column_id: string;
    title: string;
    description: string | null;
    position: number;
    created_at: string;
};

const boards = new Hono()

// Create a new board
boards.post("/", async (c) => {
    const { name } = await c.req.json();
    const normalizedName = typeof name === "string" ? name.trim() : "";
    if (!normalizedName) {
        return c.json({ error: "Board name is required." }, 400);
    }
    
    const existing = statements.boardByName.get(normalizedName);
    if (existing) {
        return c.json({ error: "Board name already exists." }, 409);
    }
    
    const boardId = crypto.randomUUID();
    const slug = `${normalizedName.toLocaleLowerCase()}-${boardId.slice(0, 4)}`;
    
    const result = statements.boardInsert.get(
        boardId,
        normalizedName,
        slug
    );
    
    return c.json(result);
});

// Get all boards
boards.get("/", (c) => {
    const boards = statements.boardsAll.all();
    return c.json(boards);
});

// Get a single board ID
boards.get("/:id", (c) => {
    const id = c.req.param("id");
    const board = statements.boardById.get(id);
    if (!board) {
        return c.json({ error: "Board not found." }, 404);
    }
    return c.json(board);
});

// Delete a board
boards.delete("/:id", (c) => {
    const id = c.req.param("id");
    const deleted = statements.boardDelete.get(id);
    if (!deleted) {
        return c.json({ error: "Board not found." }, 404);
    }
    return c.json({ message: "Board deleted successfully." });
});

boards.get("/:id/full", (c) => {
    const boardId = c.req.param("id");

    const board = statements.boardNameById.get(boardId) as
        | { name: string }
        | undefined;
    if (!board) {
        return c.json({ error: "Board not found." }, 404);
    }

    const columns = statements.columnsByBoard.all(boardId) as Column[];
    const cards = statements.cardsByBoard.all(boardId) as Card[];

    const grouped = columns.map((col) => ({
        ...col,
        cards: cards
        .filter((card) => card.column_id === col.id)
        .sort((a, b) => a.position - b.position),
    }));

    return c.json({ boardId, boardName: board.name, columns: grouped });
});

export default boards;