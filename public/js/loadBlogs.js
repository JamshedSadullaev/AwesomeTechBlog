const blogContainer = document.querySelector("#blogContainer");
let blogTitle = [];
let blogContent = [];
let blogDate = [];
let blogId = [];
let blogAuthor;
let tempBlog = [];

function addToTempBlog(title, content, author, date, id) {
  tempBlog.push({ title, content, author, date, id });
  sortBlogs(tempBlog);
  createHTML(title, content, author, date, id);
}

function sortBlogs(blog) {
  blog.sort((a, b) => {
    return a.id - b.id;
  });
}

function createHTML(title, content, author, date, id) {
  let myTitle = document.createElement("h2");
  let myContent = document.createElement("p");
  let myAuthor = document.createElement("p");
  let blogHolder = document.createElement("div");
  let myDate = date.split("T");

  myTitle.classList.add("blog-post");
  myContent.classList.add("blog-post");
  myAuthor.classList.add("blog-post");
  blogHolder.classList.add(
    "bg-dark",
    "mt-4",
    "text-light",
    "py-3",
    "px-3",
    "blog-post"
  );
  blogHolder.id = id;
  myTitle.id = id;
  myContent.id = id;
  myAuthor.id = id;

  myTitle.textContent = title;
  myContent.textContent = content;
  myAuthor.textContent = "By " + author + " on " + myDate[0];

  blogHolder.appendChild(myTitle);
  blogHolder.appendChild(myContent);
  blogHolder.appendChild(myAuthor);
  blogContainer.appendChild(blogHolder);
}

function handleLoadingBlogs() {
  fetch("/api/blog/all").then((response) =>
    response.json().then((blogs) => {
      for (let i = 0; i < blogs.length; i++) {
        blogTitle.push(blogs[i].title);
        blogContent.push(blogs[i].content);
        blogDate.push(blogs[i].createdAt);
        blogId.push(blogs[i].id);

        fetch("/api/user/findUser:" + blogs[i].UserId).then((response) =>
          response.json().then((user) => {
            blogAuthor = user;
            addToTempBlog(
              blogTitle[i],
              blogContent[i],
              blogAuthor,
              blogDate[i],
              blogId[i]
            );
          })
        );
      }
    })
  );
}

handleLoadingBlogs();

blogContainer.onclick = function (event) {
  var myBlog = event.target;

  if (myBlog.classList.contains("blog-post")) {
    let allElements = document.querySelector(`#${CSS.escape(myBlog.id)}`);
    console.log(allElements);

    localStorage.setItem("blogId", myBlog.id);
    localStorage.setItem("blogPost", allElements.innerHTML);
    console.log(localStorage.getItem("blogPost"));
    window.location.href = "/addComment";
  }
};
