let page_num = 0;

function load_filtered_posts(filter_type, filter_val) {
	clear_page()
	let requestStr;

	if (filter_type === "user") {
		requestStr = `../user/${filter_val}/posts`

	} else if (filter_type === "following") {
		if (filter_val) {
			requestStr = `../posts/following`
		}
	} else {
		requestStr = `../posts/following`
	}
	fetch(requestStr)
			.then(response => response.json())
			.then(posts => posts.forEach(post => add_post(post)))
}

function load_posts() {
	load_filtered_posts("", "")
}

function add_post(post) {
	const li = document.createElement("li")
	li.className = "list-group-item mx-auto col-md-6"
	li.innerHTML = `
				<p><a href="user/${post.user}"><b>${post.user}</b></a></p>
				<p>${post.text}</p>
				<p class="small">${post.timestamp}</p>
		`
	document.getElementById("posts").append(li)

	console.log("Added post: " + post.id)
}

function clear_page() {
	document.getElementById("posts").innerHTML = ``
}
function previous_page() {
	page_num --;

	make_posts()
}