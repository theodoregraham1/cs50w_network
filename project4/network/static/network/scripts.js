const PREVIOUS_PAGE_BTN = "page-previous-btn";
const NEXT_PAGE_BTN = "page-next-btn";

const POSTS_PER_PAGE = 10;

let page_num = 0;
let user_id = 0;

document.addEventListener("DOMContentLoaded", function () {
	disable_button(PREVIOUS_PAGE_BTN)
	user_id = JSON.parse(document.getElementById('user_id').textContent);
})

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
		requestStr = `../posts`
	}

	fetch(requestStr)
			.then(response => response.json())
			.then(posts => {
				let posts_to_display = posts.slice(page_num * POSTS_PER_PAGE, (page_num+1) * POSTS_PER_PAGE);

				if (posts_to_display.length < POSTS_PER_PAGE || posts.length === POSTS_PER_PAGE * (page_num+1)) {
					disable_button(NEXT_PAGE_BTN)
				} else {
					activate_button(NEXT_PAGE_BTN)
				}

				posts_to_display.forEach(post => add_post(post))
			})
}

function load_posts() {
	load_filtered_posts("", "")
}

function add_post(post) {
	console.log(post)

	const li = document.createElement("li")

	li.id = `post-${post.id}`;
	li.className = "list-group-item mx-auto col-md-6"
	li.innerHTML = `
				<p><a href="user/${post.username}"><b>${post.username}</b></a></p>
				<p id="post-text-${post.id}">${post.text}</p>
				<p class="small">${post.timestamp}</p>
		`;
	if (user_id === post.userid) {
		li.innerHTML += `<button id="post-edit-${post.id}" class="badge badge-warning" onclick="open_edit_box(${post.id})">Edit</button>`;
	}

	document.getElementById("posts").append(li)

	console.log("Added post: " + post.id)
}

function clear_page() {
	document.getElementById("posts").innerHTML = ``
}

function previous_page() {
	page_num --;

	if (page_num <= 0) {
		disable_button(PREVIOUS_PAGE_BTN)
	}

	console.log("Going to page ", page_num)
	make_posts();
}

function next_page() {
	page_num ++;

	activate_button(PREVIOUS_PAGE_BTN)

	console.log("Going to page ", page_num)
	make_posts();
}

function disable_button(id) {
	let btn = document.getElementById(id);

	btn.disabled = true;
	btn.classList.add("disabled");
	btn.tabIndex = -1;
	btn.ariaDisabled = "true";

	console.log("Disabled button: ", id)
}

function activate_button(id) {
	let btn = document.getElementById(id);

	btn.disabled = false;
	btn.classList.remove("disabled");
	btn.tabIndex = 1;
	btn.ariaDisabled = "false";

	console.log("Activated button: ", id)
}

function open_edit_box(post_id) {
	// Add textarea for editing
	const post_text = document.getElementById(`post-text-${post_id}`);

	const text = post_text.innerText;
	post_text.innerHTML = `
		<form id="post-edit-form-${post_id}" class="form-group">
			<textarea id="post-edit-text-${post_id}" class="form-control" rows="5">${text}</textarea>
			<input class="btn btn-warning" value="Save" type="submit">
		</form>
	`
	let form = document.getElementById(`post-edit-form-${post_id}`);
	form.addEventListener('submit', event => {
		event.preventDefault();
		edit_post(post_id);
	});

	// Remove edit button
	document.getElementById(`post-edit-${post_id}`).hidden = true;
}

function edit_post(post_id) {
	let data = new FormData();

	data.append('text', document.getElementById(`post-edit-text-${post_id}`).value);
	data.append('post_id', post_id);
	data.append("csrfmiddlewaretoken", document.getElementsByName("csrfmiddlewaretoken")[0].value)

	fetch("../edit", {
		method: "POST",
		body: data,
	})
		.then(response => response.json())
		.then(post => {
			const li = document.getElementById(`post-${post_id}`)

			li.innerHTML = `
				<p><a href="user/${post.username}"><b>${post.username}</b></a></p>
				<p id="post-text-${post.id}">${post.text}</p>
				<p class="small">${post.timestamp}</p>
			`;

			if (user_id === post.userid) {
				li.innerHTML += `<button id="post-edit-${post.id}" class="badge badge-warning" onclick="open_edit_box(${post.id})">Edit</button>`;
			}
		})
}
