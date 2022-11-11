const blogContainer = document.querySelector("#my-blogs");

function newPost() {
  window.location.href = "/newPost";
}

function updatePost(id) {
  localStorage.setItem("postId", id);
  window.location.href = "/updatePost";
}

function createHTML(title, date, id) {
  let blog = document.createElement("div");
  let date = date.split("T");
  let bButton = document.createElement("button");
  bButton.classList.add("flex-fill", "btn", "btn-dark", "mt-2");
  bButton.id = id;

  bButton.textContent = title + " --- " + date[0];
  bButton.setAttribute("onClick", "updatePost(" + bButton.id + ")");

  blog.appendChild(bButton);
  blogContainer.appendChild(blog);
}

function handleLoadingBlogs() {
  fetch("/api/blog/").then((response) =>
    response.json().then((myBlogs) => {
      console.log(myBlogs);
      for (myBlog of myBlogs) {
        createHTML(myBlog.title, myBlog.createdAt, myBlog.id);
      }
    })
  );
}

handleLoadingBlogs();
