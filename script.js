async function getUsers() {
  const response = await fetch("http://localhost:3000/users");
  const data = await response.json();
  console.log(data);
}

async function getSpecificUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}`);
  const data = await response.json();
  console.log(data);
}

async function addUser() {
  const response = await fetch(`http://localhost:3000/users/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: 3, username: "Emelie", password: "1111" }),
  });

  const data = await response.json();
  console.log(data);
}

async function editUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ password: "8888" }),
  });

  const data = await response.json();
  console.log(data);
}

async function deleteUser(id) {
  const response = await fetch(`http://localhost:3000/users/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();
  console.log(data);
}
deleteUser(1);
