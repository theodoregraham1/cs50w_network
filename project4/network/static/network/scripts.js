const PREVIOUS_PAGE_BTN = "page-previous-btn";
const NEXT_PAGE_BTN = "page-next-btn";

const POSTS_PER_PAGE = 10;

let page_num = 0;

document.addEventListener("DOMContentLoaded", function () {
	disable_button(PREVIOUS_PAGE_BTN)
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