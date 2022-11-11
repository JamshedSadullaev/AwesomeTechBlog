let blogID = localStorage.getItem("postId");
let myTitle = document.querySelector("#title");
let myContent = document.querySelector("#content");
let updateBtn = document.querySelector("#update-btn");
let deleteBtn = document.querySelector("#delete-btn");

function updateFormHandler(event) {
  event.preventDefault();
  const title = document.querySelector("#title").value;
  console.log(title);
  const content = document.querySelector("#content").value;
  console.log(content);

  if (title && content) {
    fetch("/api/blog/update:" + blogID, {
      method: "PUT",
      body: JSON.stringify({ title, content }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.ok) {
        document.location.replace("/dashboard");
      } else {
        document.location.replace("/");
      }
    });
  }
}

function deletePostHandler(event) {
  event.preventDefault();

  fetch("/api/blog/delete:" + blogID, {
    method: "DELETE",
  }).then((response) => {
    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      document.location.replace("/");
    }
  });
}

function populateFields(title, content) {
  myTitle.value = title;
  myContent.textContent = content;
}

function handleLoadingBlogs() {
  fetch("/api/blog/one:" + blogID).then((response) =>
    response.json().then((myBlogs) => {
      console.log(myBlogs);
      populateFields(myBlogs.title, myBlogs.content);
    })
  );
}

handleLoadingBlogs();

deleteBtn.addEventListener("click", deletePostHandler);
updateBtn.addEventListener("click", updateFormHandler);
