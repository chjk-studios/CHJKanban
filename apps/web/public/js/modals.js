const OPEN_ATTR = "data-modal-open";
const CLOSE_ATTR = "data-modal-close";
const MODAL_ATTR = "data-modal";
const OVERLAY_ATTR = "data-modal-overlay";

const openStack = [];
const focusableSelector =
	"a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex='-1'])";

const getModalById = (id) => {
	if (!id) return null;
	return document.getElementById(id);
};

const trapFocus = (modal) => {
	const focusables = Array.from(modal.querySelectorAll(focusableSelector));
	if (!focusables.length) return () => {};

	const first = focusables[0];
	const last = focusables[focusables.length - 1];
	const handler = (event) => {
		if (event.key !== "Tab") return;
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault();
			last.focus();
			return;
		}
		if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault();
			first.focus();
		}
	};

	modal.addEventListener("keydown", handler);
	return () => modal.removeEventListener("keydown", handler);
};

const openModal = (modal) => {
	if (!modal || openStack.includes(modal)) return;
	const panel = modal.querySelector(".modal__panel");
	const previouslyFocused = document.activeElement;

	modal.classList.add("is-open");
	modal.setAttribute("aria-hidden", "false");
	document.body.classList.add("modal-open");

	const removeTrap = trapFocus(modal);
	openStack.push({ modal, previouslyFocused, removeTrap });

	if (panel) {
		const focusTarget = panel.querySelector(focusableSelector) || panel;
		focusTarget.focus({ preventScroll: true });
	}
};

const closeModal = (modal) => {
	const index = openStack.findIndex((entry) => entry.modal === modal);
	if (index === -1) return;

	const entry = openStack.splice(index, 1)[0];
	entry.removeTrap();

	modal.classList.remove("is-open");
	modal.setAttribute("aria-hidden", "true");

	if (!openStack.length) {
		document.body.classList.remove("modal-open");
	}

	if (entry.previouslyFocused && entry.previouslyFocused.focus) {
		entry.previouslyFocused.focus({ preventScroll: true });
	}
};

const closeTopModal = () => {
	const last = openStack[openStack.length - 1];
	if (last) closeModal(last.modal);
};

document.addEventListener("click", (event) => {
	const openTrigger = event.target.closest(`[${OPEN_ATTR}]`);
	if (openTrigger) {
		event.preventDefault();
		const targetId = openTrigger.getAttribute(OPEN_ATTR);
		openModal(getModalById(targetId));
		return;
	}

	const closeTrigger = event.target.closest(`[${CLOSE_ATTR}]`);
	if (closeTrigger) {
		event.preventDefault();
		const modal = closeTrigger.closest(`[${MODAL_ATTR}]`);
		closeModal(modal);
		return;
	}

	const overlay = event.target.closest(`[${OVERLAY_ATTR}]`);
	if (overlay) {
		const modal = overlay.closest(`[${MODAL_ATTR}]`);
		closeModal(modal);
	}
});

document.addEventListener("keydown", (event) => {
	if (event.key === "Escape") {
		closeTopModal();
	}
});

window.Modal = {
	open: (id) => openModal(getModalById(id)),
	close: (id) => closeModal(getModalById(id)),
};
