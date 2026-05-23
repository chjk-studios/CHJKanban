const normalizeBaseUrl = (url) => (url || "").replace(/\/+$/, "");
const backendURL = normalizeBaseUrl(
    window.__BACKEND_URL || "https://gbd5qjlc-3000.euw.devtunnels.ms"
);
const boardEl = document.getElementById("board");
const boardTitle = document.getElementById("board-title");
const navLinksSkeleton = document.getElementById("nav-links-skeleton");

function editSkeleton(state) {
    navLinksSkeleton.style.display = state ? "block" : "none";
}

async function getBoards() {
    const result = await fetch(`${backendURL}/boards`)
    const data = await result.json()
    console.log(data)
    return data;
}

async function getFullBoard(boardId) {
    const result = await fetch(`${backendURL}/boards/${boardId}/full`)
    const data = await result.json()
    console.log(data)
    return data;
}

async function getColumns(boardId) {
    const result = await fetch(`${backendURL}/columns?boardId=${boardId}`)
    const data = await result.json()
    console.log(data)
    return data;
}

function getHash() {
    const hash = window.location.hash || "";
    const boardId = hash.replace(/^#/, "").trim();
    return boardId.length > 0 ? boardId : null;
}

async function populateBoard() {
    const boardId = getHash();
    if (!boardId) return;
    boardEl.innerHTML = "";
        
    const board = await getFullBoard(boardId);
    if (board.columns.length === 0) {
        boardEl.innerHTML = "<p class='empty-board'>This board has no columns yet.</p>"
        return;
    }
    
    board.columns.forEach(column => {
        const columnEl = document.createElement("div");
        columnEl.classList.add("column");
        columnEl.innerHTML = `
            <div class="column-header">
                <div>
                    <p class="column-title">${column.name}</p>
                    <p class="column-meta">0 cards</p>
                </div>
                <span class="status-dot ${column.type}"></span>
            </div>`;
        boardEl.appendChild(columnEl);
        column.cards.forEach(card => {
            const cardEl = document.createElement("div");
            cardEl.classList.add("card");
            cardEl.innerHTML = `
            <h3>${card.title}</h3>
            <div class="card-body">${card.description}</div>
            `;
            columnEl.appendChild(cardEl);
        });
        
    });
    boardTitle.textContent = board.boardName;
}
/*

<div class="column">
	<div class="column-header">
		<div>
			<p class="column-title">Done</p>
			<p class="column-meta">8 cards</p>
	    </div>
		<span class="status-dot done"></span>
	</div>
	<div class="card">
		<div class="card-header">
			<span class="pill done">Shipped</span>
			<span class="card-id">#121</span>
		</div>
		<h3>Launch focus mode</h3>
		<p class="card-body">Released distraction-free layout for power users.</p>
		<div class="card-footer">
			<div class="avatars">
			<span class="avatar">RB</span>
			<span class="avatar">TX</span>
		</div>
		<span class="due">Done</span>
	</div>
</div>

*/
async function populateNav() {
    const boards = await getBoards();
    const navLinks = document.getElementById("nav-links");
    editSkeleton(false);
    boards.forEach(board => {
        const link = document.createElement("a");
        link.classList.add("nav-link");
        link.href = `#${board.id}`;
        link.innerHTML = `<span class="nav-dot"></span>${board.name}`;
        navLinks.appendChild(link);
    });
}

populateNav()
populateBoard()
window.addEventListener("hashchange", populateBoard);