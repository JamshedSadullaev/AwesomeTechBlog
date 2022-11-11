const logoutElement = document.querySelector("#logout");

const handleLogout = async (event) => {
  event.preventDefault();
  const response = await fetch("/api/user/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (response.ok) {
    document.location.replace("/");
  } else {
    alert("Something is preventing you from logging out");
  }
};

logoutElement.addEventListener("click", handleLogout);
