const blogNum = localStorage.getItem("blogId");
const blogContainer = document.querySelector("#blog-post");
const commentContainer = document.querySelector("#comment-container");
const myModal = document.querySelector("#update-modal");
const submitBtn = document.querySelector("#submit");
const updateBtn = document.querySelector("#update");
const deleteBtn = document.querySelector("#delete");
const commentBox = document.querySelector("#content");
const cancelBtn = document.querySelector("#cancel");

function addAuthor(author, currentIndex) {
  let myAuthor = document.createElement("p");
  let holder = document.querySelector(`#${CSS.escape(currentIndex)}_holder`);
  myAuthor.classList.add("comment");

  myAuthor.textContent = "--- " + author;
  myAuthor.id = currentIndex;

  holder.appendChild(myAuthor);
}

function createHTML(content, currentIndex) {
  let myContent = document.createElement("p");
  let commentHolder = document.createElement("div");

  myContent.classList.add("comment");
  commentHolder.classList.add(
    "bg-light",
    "mt-4",
    "text-dark",
    "py-3",
    "px-3",
    "comment"
  );
  commentHolder.id = currentIndex + "_holder";
  myContent.id = currentIndex;

  myContent.textContent = content;

  commentHolder.appendChild(myContent);
  commentContainer.classList.add("comment");
  commentContainer.id = currentIndex;
  commentContainer.appendChild(commentHolder);
}

function loadExistingComments() {
  fetch("/api/comment/getConnected:" + blogNum).then((response) =>
    response.json().then((comments) => {
      for (let i = 0; i < comments.length; i++) {
        createHTML(comments[i].content, comments[i].id);
        fetch("/api/user/findUser:" + comments[i].posterId).then((response) =>
          response.json().then((poster) => {
            addAuthor(poster, comments[i].id);
          })
        );
      }
    })
  );
}

function handleLoadingBlogs() {
  const post = localStorage.getItem("blogPost");
  let mytempHTML = document.createElement("div");
  mytempHTML.classList.add(
    "bg-dark",
    "mt-4",
    "text-light",
    "py-3",
    "px-3",
    "blog-post"
  );
  mytempHTML.innerHTML = post;
  blogContainer.appendChild(mytempHTML);
  loadExistingComments();
}

function updateFormHandler(event) {
  event.stopImmediatePropagation();
  event.preventDefault();

  const content = document.querySelector("#content").value;

  if (content) {
    fetch("/api/comment/update:" + returnCommentId(), {
      method: "PUT",
      body: JSON.stringify({ content }),
      headers: { "Content-Type": "application/json" },
    }).then((response) => {
      if (response.ok) {
        document.location.replace("/addComment");
      } else {
        document.location.replace("/");
      }
    });
  }
}

updateBtn.addEventListener("click", updateFormHandler);

const commentFormHandler = async (event) => {
  event.stopImmediatePropagation();
  event.preventDefault();

  const content = document.querySelector("#content").value;

  if (content) {
    const response = await fetch("/api/comment", {
      method: "POST",
      body: JSON.stringify({ content, blogNum }),
      headers: { "Content-Type": "application/json" },
    });

    if (response.ok) {
      document.location.replace("/addComment");
    } else {
      document.location.replace("/");
    }
  }
};

submitBtn.addEventListener("click", commentFormHandler);

function cancelAction() {
  event.stopImmediatePropagation();
  event.preventDefault();
  window.location.href = "/addComment";
}

cancelBtn.addEventListener("click", cancelAction);

function returnCommentId() {
  let id = localStorage.getItem("commentId");
  if (id.includes("_holder")) {
    id.split("_");
    return id[0];
  }
  return id;
}

function deleteComment() {
  event.stopImmediatePropagation();
  event.preventDefault();
  let commentId = returnCommentId();
  fetch("/api/comment/delete:" + commentId, { method: "DELETE" }).then(
    (response) =>
      response.json().then(() => {
        window.location.href = "/addComment";
      })
  );
}

deleteBtn.addEventListener("click", deleteComment);

function updateCommentBox(commentId) {
  updateBtn.classList.replace("invisible", "visible");
  deleteBtn.classList.replace("invisible", "visible");
  cancelBtn.classList.replace("invisible", "visible");
  submitBtn.classList.replace("visible", "invisible");
  fetch("/api/comment/getOne:" + commentId).then((response) =>
    response.json().then((comment) => {
      commentBox.textContent = comment;
    })
  );
}

commentContainer.onclick = function (event) {
  var myComment = event.target;

  if (myComment.classList.contains("comment")) {
    let allElements = document.querySelector(`#${CSS.escape(myComment.id)}`);
    console.log(allElements);

    localStorage.setItem("commentId", myComment.id);
    localStorage.setItem("postedComment", allElements.innerHTML);
    console.log(localStorage.getItem("postedComment"));
    updateCommentBox(myComment.id);
  }
};

handleLoadingBlogs();
