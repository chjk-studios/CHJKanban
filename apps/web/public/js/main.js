import toast from "https://esm.sh/toast-anchor"
import { closeTopModal, openModal } from "/js/modals.js";

const normalizeBaseUrl = (url) => (url || "").replace(/\/+$/, "");
const backendURL = normalizeBaseUrl(
    window.__BACKEND_URL || "https://gbd5qjlc-3000.euw.devtunnels.ms"
);

let columnList = [];
let boardList = [];
let cardList = [];
let currentBoard = null;

const createCardBtnTopbar = document.getElementById("add-card-btn-topbar");

const boardEl = document.getElementById("board");
const boardTitle = document.getElementById("board-title");
const navLinksSkeleton = document.getElementById("nav-links-skeleton");

const createColumnBtn = document.getElementById("create-new-column-btn");
const createColumnTitle = document.getElementById("column-modal-title");
const createColumnType = document.getElementById("column-modal-type");
const createColumnPosition = document.getElementById("column-modal-position");

const createCardBtn = document.getElementById("create-new-card-btn");
const createCardTitle = document.getElementById("card-modal-title");
const createCardDescription = document.getElementById("card-modal-description");

function editSkeleton(state) {
    navLinksSkeleton.style.display = state ? "block" : "none";
}

async function connectionCheck() {
    try {
        const response = await fetch(`${backendURL}/health`);
        if (response.ok) {
            return true;
        } else {
            openModal(document.getElementById("backend-unavailable-modal"));
            document.getElementById("sidebar-card-backend").style.opacity = 1;
            document.getElementById("sidebar-card-backend").style.display = "block";
            document.getElementById("sidebar-card-backend").style.border = "1px solid rgba(239, 68, 68, 0.35)";
            return false;
        }
    } catch (error) {
        console.error("Error checking connection:", error);
        openModal(document.getElementById("backend-unavailable-modal"));
        document.getElementById("sidebar-card-backend").style.opacity = 1;
        document.getElementById("sidebar-card-backend").style.display = "block";
        document.getElementById("sidebar-card-backend").style.border = "1px solid rgba(239, 68, 68, 0.35)";
        return false;
    }
}

async function getBoards() {
    const result = await fetch(`${backendURL}/boards`)
    const data = await result.json()
    return data;
}

async function getFullBoard(boardId) {
    const result = await fetch(`${backendURL}/boards/${boardId}/full`)
    const data = await result.json()
    return data;
}

async function getColumns(boardId) {
    const result = await fetch(`${backendURL}/columns/${boardId}`)
    const data = await result.json()
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

    currentBoard = board;
    console.log("current board", board);
    
    board.columns.forEach(column => {
        columnList.push(column);
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
            cardList.push(card);
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

async function createCard(title, description, position, columnid) {
    if (!title || !description || position === undefined || !columnid) return;

    try {
        return fetch(`${backendURL}/cards/${columnid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                position: position
            })
        })
    } catch (error) {
        console.error("Error creating card:", error);
        return null;
    }
}

async function createColumn(title, position, type) {
    if (!title || !type || position === undefined) return;

    try {
        return fetch(`${backendURL}/columns/${currentBoard.boardId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                position: position,
                type: type
            })
        })
    } catch (error) {
        console.error("Error creating column:", error);

        return null;
    }
}

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
connectionCheck()
window.addEventListener("hashchange", populateBoard);

createCardBtnTopbar.addEventListener("click", (e) => {
    if (currentBoard === null) {
        toast.anchored('Select a board first.', document.getElementById("nav-links"), {
            type: 'warning',
            position: 'right',
            bg: 'var(--red-dark)',
            borderColor: 'var(--red)',
            borderWidth: '1px',
        });
        e.preventDefault();
        setTimeout(() => {
            closeTopModal();
        }, 10);
        return;
    }
    document.getElementById("card-modal-column").innerHTML = `<option value="" disabled selected>Select column</option>` + columnList.map(column => `<option value="${column.id}">${column.name} [${column.id}]</option>`).join("");
});

createCardBtn.addEventListener("click", async () => {
    console.log("Create card clicked");
    const title = createCardTitle.value;
    const description = createCardDescription.value;
    const position = 0;
    const columnId = document.getElementById("card-modal-column").value;
    const result = await createCard(title, description, position, columnId);
    if (result.ok) {
        closeTopModal();
        toast.success('Card created successfully.', {
            position: 'middle-center',
            showProgress: true,
            showClose: true,
            bg: '#0b0f0d',
            color: '#ecfdf5',
            descColor: '#6ee7b7',
            borderColor: 'rgba(16,185,129,0.25)',
            iconBg: 'rgba(16,185,129,0.15)',
            iconColor: '#10b981',
            progressColor: '#006b47',
        });
    }
});
    

createColumnBtn.addEventListener("click", () => {
    console.log("Create column clicked");
    const title = createColumnTitle.value;
    const type = createColumnType.value;
    const position = parseInt(createColumnPosition.value) || 0;
    createColumn(title, position, type);
});