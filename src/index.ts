interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    website: string;
}

const users: User[] = [];

const userList = document.getElementById("userList");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");

const editForm = document.getElementById("editForm") as HTMLFormElement | null;
const editName = document.getElementById("editName") as HTMLInputElement | null;
const editEmail = document.getElementById("editEmail") as HTMLInputElement | null;
const editPhone = document.getElementById("editPhone") as HTMLInputElement | null;
const editWebsite = document.getElementById("editWebsite") as HTMLInputElement | null;
const cancelEdit = document.getElementById("cancelEdit") as HTMLButtonElement | null;

const userDetails = document.getElementById("userDetails") as HTMLDivElement | null;
const detailsContent = document.getElementById("detailsContent") as HTMLDivElement | null;
const closeDetails = document.getElementById("closeDetails") as HTMLButtonElement | null;

const searchInput = document.getElementById("searchInput") as HTMLInputElement | null;

const userForm = document.getElementById("userForm") as HTMLFormElement | null;
const nameInput = document.getElementById("name") as HTMLInputElement | null;
const emailInput = document.getElementById("email") as HTMLInputElement | null;
const phoneInput = document.getElementById("phone") as HTMLInputElement | null;
const websiteInput = document.getElementById("website") as HTMLInputElement | null;

let editingUserId: number | null = null;

async function fetchUsers(): Promise<void> {
    if (loadingElement) {
        loadingElement.style.display = "block";
    }

    if (errorElement) {
        errorElement.style.display = "none";
    }

    try {
        const response = await fetch(
            "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
            throw new Error("Failed to fetch users.");
        }

        const data: User[] = await response.json();

        users.push(...data);

        displayUsers(users);
    } catch (error) {
        console.error(error);

        if (errorElement) {
            errorElement.textContent =
                "Could not load users. Please try again.";
            errorElement.style.display = "block";
        }
    } finally {
        if (loadingElement) {
            loadingElement.style.display = "none";
        }
    }
}

function displayUsers(users: User[]): void {
    if (!userList) {
        return;
    }

    userList.innerHTML = "";

    for (const user of users) {
        const userElement = document.createElement("div");

        userElement.innerHTML = `
            <h2>${user.name}</h2>
            <p>Email: ${user.email}</p>
            <p>Phone: ${user.phone}</p>
            <p>Website: ${user.website}</p>
            <button class="view-btn">View Details</button>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

        const viewButton = userElement.querySelector(".view-btn");

        viewButton?.addEventListener("click", () => {
            showUserDetails(user.id);
        });

        const editButton = userElement.querySelector(".edit-btn");

        editButton?.addEventListener("click", () => {
            editUser(user.id);
        });

        const deleteButton = userElement.querySelector(".delete-btn");

        deleteButton?.addEventListener("click", () => {
            deleteUser(user.id);
        });

        userList.appendChild(userElement);
    }
}

function showUserDetails(id: number): void {
    const user = users.find((user) => user.id === id);

    if (!user || !userDetails || !detailsContent) {
        return;
    }

    detailsContent.innerHTML = `
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>Phone:</strong> ${user.phone}</p>
        <p><strong>Website:</strong> ${user.website}</p>
    `;

    userDetails.style.display = "block";
}

closeDetails?.addEventListener("click", () => {
    if (userDetails) {
        userDetails.style.display = "none";
    }
});

function deleteUser(id: number): void {
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return;
    }

    users.splice(index, 1);

    displayUsers(users);
}

function editUser(id: number): void {
    const user = users.find((user) => user.id === id);

    if (!user || !editForm || !editName || !editEmail || !editPhone || !editWebsite) {
        return;
    }

    editingUserId = id;

    editName.value = user.name;
    editEmail.value = user.email;
    editPhone.value = user.phone;
    editWebsite.value = user.website;

    editForm.style.display = "block";
}

editForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (editingUserId === null) {
        return;
    }

    const user = users.find((user) => user.id === editingUserId);

    if (!user || !editName || !editEmail || !editPhone || !editWebsite) {
        return;
    }

    user.name = editName.value;
    user.email = editEmail.value;
    user.phone = editPhone.value;
    user.website = editWebsite.value;

    editingUserId = null;
    editForm.style.display = "none";

    displayUsers(users);
});

cancelEdit?.addEventListener("click", () => {
    editingUserId = null;

    if (editForm) {
        editForm.style.display = "none";
    }
});

function searchUsers(searchTerm: string): User[] {
    const term = searchTerm.toLowerCase();

    return users.filter((user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
}

searchInput?.addEventListener("input", () => {
    const searchTerm = searchInput.value;

    const filteredUsers = searchUsers(searchTerm);

    displayUsers(filteredUsers);
});

userForm?.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!nameInput || !emailInput || !phoneInput || !websiteInput) {
        return;
    }

    const newUser: User = {
        id: users.length + 1,
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneInput.value,
        website: websiteInput.value
    };

    users.push(newUser);

    displayUsers(users);

    userForm.reset();
});

fetchUsers();