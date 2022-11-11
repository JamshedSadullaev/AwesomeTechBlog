const blogFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#title").value;
  const content = document.querySelector("#content").value;

  if (title && content) {
    const response = await fetch("/api/blog", {
      method: "POST",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      document.location.replace("/");
    }
  }
};

document
  .querySelector(".blog-form")
  .addEventListener("submit", blogFormHandler);
