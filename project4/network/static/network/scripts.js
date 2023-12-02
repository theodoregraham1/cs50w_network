document.addEventListener("DOMContentLoaded", function () {
	load_posts();
})

function load_posts() {
	fetch("posts")
		.then(response => response.json())
		.then(posts => {
			console.log(posts)

			posts.forEach((post) => add_post(post))
		})
}

function add_post(post) {
	const li = document.createElement("li")
	li.className = "list-group-item mx-auto col-md-6"
	li.innerHTML = `
				<p><b>${post.user}</b></p>
				<p>${post.text}</p>
				<p class="small">${post.timestamp}</p>
		`
	document.getElementById("posts").append(li)

	console.log("Added post: " + post.id)
}