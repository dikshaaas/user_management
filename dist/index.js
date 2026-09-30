const users = [];
const userList = document.getElementById("userList");
const loadingElement = document.getElementById("loading");
const errorElement = document.getElementById("error");
const editForm = document.getElementById("editForm");
const editName = document.getElementById("editName");
const editEmail = document.getElementById("editEmail");
const editPhone = document.getElementById("editPhone");
const editWebsite = document.getElementById("editWebsite");
const cancelEdit = document.getElementById("cancelEdit");
const userDetails = document.getElementById("userDetails");
const detailsContent = document.getElementById("detailsContent");
const closeDetails = document.getElementById("closeDetails");
const searchInput = document.getElementById("searchInput");
const userForm = document.getElementById("userForm");
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const websiteInput = document.getElementById("website");
let editingUserId = null;
async function fetchUsers() {
    if (loadingElement) {
        loadingElement.style.display = "block";
    }
    if (errorElement) {
        errorElement.style.display = "none";
    }
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) {
            throw new Error("Failed to fetch users.");
        }
        const data = await response.json();
        users.push(...data);
        displayUsers(users);
    }
    catch (error) {
        console.error(error);
        if (errorElement) {
            errorElement.textContent =
                "Could not load users. Please try again.";
            errorElement.style.display = "block";
        }
    }
    finally {
        if (loadingElement) {
            loadingElement.style.display = "none";
        }
    }
}
function displayUsers(users) {
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
function showUserDetails(id) {
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
function deleteUser(id) {
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) {
        return;
    }
    users.splice(index, 1);
    displayUsers(users);
}
function editUser(id) {
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
function searchUsers(searchTerm) {
    const term = searchTerm.toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term));
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
    const newUser = {
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
export {};
//# sourceMappingURL=index.js.map