import { profile, bookCollection, createIntroduction } from "./app.js";

const bookListContainer = document.querySelector("#book-list-tbody");
const emptyMessageEl = document.querySelector("#empty-book-message");
const filterCategoryNav = document.querySelector("#filter-category");

const addBookForm = document.querySelector("#add-book-form");
const titleInput = document.querySelector("#book-title");
const authorInput = document.querySelector("#author-name");
const genreInput = document.querySelector("#book-genre");
const statusInput = document.querySelector("#reading-status");
const submitBtn = document.querySelector("#submit-btn");

let currentCategory = "all";

function renderProfile() {
    document.querySelector("#profile-name").textContent = profile.name;
    document.querySelector("#profile-intro").textContent = createIntroduction(profile);
    
    const skillsContainer = document.querySelector("#profile-skills");
    skillsContainer.textContent = "";
    profile.skills.forEach(skill => {
        const badge = document.createElement("span");
        badge.className = "skill-badge";
        badge.textContent = skill;
        skillsContainer.append(badge);
    });

    document.querySelector("#footer-text").textContent = `${profile.name} · ${profile.studentId} · ${profile.year}`;
}

function getStatusBadgeClass(status) {
    if (status === "Completed") return "status-completed";
    if (status === "Reading") return "status-reading";
    return "status-plan";
}

function buildBookRow(book, index) {
    const tr = document.createElement("tr");

    const thNo = document.createElement("th");
    thNo.scope = "row";
    thNo.textContent = index + 1;

    const tdTitle = document.createElement("td");
    tdTitle.textContent = book.title;

    const tdAuthor = document.createElement("td");
    tdAuthor.textContent = book.author;

    const tdGenre = document.createElement("td");
    tdGenre.textContent = book.genre;

    const tdStatus = document.createElement("td");
    const statusBadge = document.createElement("span");
    statusBadge.className = `status-badge ${getStatusBadgeClass(book.status)}`;
    statusBadge.textContent = book.status;
    tdStatus.append(statusBadge);

    const tdAction = document.createElement("td");
    tdAction.className = "action-cells";

    const statusBtn = document.createElement("button");
    statusBtn.className = "btn-action btn-status";
    statusBtn.textContent = "Change Status";
    statusBtn.dataset.id = book.id;
    statusBtn.dataset.action = "change-status";

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn-action btn-delete";
    deleteBtn.textContent = "Delete";
    deleteBtn.dataset.id = book.id;
    deleteBtn.dataset.action = "delete";

    tdAction.append(statusBtn, deleteBtn);

    tr.append(thNo, tdTitle, tdAuthor, tdGenre, tdStatus, tdAction);
    return tr;
}

function renderBooks(list) {
    bookListContainer.textContent = "";

    if (list.length === 0) {
        emptyMessageEl.hidden = false;
        return;
    }

    emptyMessageEl.hidden = true;

    list.forEach((book, index) => {
        bookListContainer.append(buildBookRow(book, index));
    });
}

function refreshCurrentView() {
    const filtered = bookCollection.filter(
        (book) => currentCategory === "all" || book.genre === currentCategory
    );
    renderBooks(filtered);
}

function initFilter() {
    filterCategoryNav.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;

        currentCategory = button.dataset.category;

        filterCategoryNav.querySelectorAll("button").forEach((btn) => {
            btn.classList.toggle("active", btn === button);
        });

        refreshCurrentView();
    });
}

function initTableActions() {
    bookListContainer.addEventListener("click", (event) => {
        const button = event.target.closest("button");
        if (!button) return;

        const action = button.dataset.action;
        const bookId = Number(button.dataset.id);

        const bookIndex = bookCollection.findIndex((b) => b.id === bookId);
        if (bookIndex === -1) return;

        if (action === "delete") {
            const isConfirmed = confirm(`Are you sure you want to delete "${bookCollection[bookIndex].title}"?`);
            if (isConfirmed) {
                bookCollection.splice(bookIndex, 1);
                refreshCurrentView();
            }
        }

        if (action === "change-status") {
            const currentStatus = bookCollection[bookIndex].status;
            if (currentStatus === "Plan to Read") {
                bookCollection[bookIndex].status = "Reading";
            } else if (currentStatus === "Reading") {
                bookCollection[bookIndex].status = "Completed";
            } else {
                bookCollection[bookIndex].status = "Plan to Read";
            }
            refreshCurrentView();
        }
    });
}

function initFormValidation() {
    function validateField(field, errorElId) {
        const errorEl = document.querySelector(errorElId);
        const isValid = field.value.trim() !== "";

        if (!isValid) {
            field.setAttribute("aria-invalid", "true");
            if (errorEl) errorEl.style.display = "block";
        } else {
            field.removeAttribute("aria-invalid");
            if (errorEl) errorEl.style.display = "none";
        }
        return isValid;
    }

    function checkFormValidity() {
        const isTitleValid = titleInput.value.trim() !== "";
        const isAuthorValid = authorInput.value.trim() !== "";
        const isGenreValid = genreInput.value.trim() !== "";
        const isStatusValid = statusInput.value.trim() !== "";

        const allValid = isTitleValid && isAuthorValid && isGenreValid && isStatusValid;
        submitBtn.disabled = !allValid;
    }

    [titleInput, authorInput, genreInput, statusInput].forEach((input) => {
        input.addEventListener("input", checkFormValidity);
        input.addEventListener("blur", () => {
            if (input === titleInput) validateField(titleInput, "#title-error");
            if (input === authorInput) validateField(authorInput, "#author-error");
            if (input === genreInput) validateField(genreInput, "#genre-error");
            if (input === statusInput) validateField(statusInput, "#status-error");
            checkFormValidity();
        });
    });

    addBookForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const newBook = {
            id: Date.now(),
            title: titleInput.value.trim(),
            author: authorInput.value.trim(),
            genre: genreInput.value.trim(),
            status: statusInput.value.trim()
        };

        bookCollection.push(newBook);
        refreshCurrentView();

        addBookForm.reset();
        checkFormValidity();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    renderProfile();
    renderBooks(bookCollection);
    initFilter();
    initTableActions();
    initFormValidation();
});