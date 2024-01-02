
document.addEventListener("DOMContentLoaded", function () {
	const profile_id = JSON.parse(document.getElementById('profile_id').textContent);
	console.log(profile_id);
	load_filtered_posts("user", profile_id)
})

function follow() {
	fetch(`../follow/${profile_id}`)
		.then(response => response.json())
		.then(response => {
			show_follow_button(response["following"])
			console.log(response)

			if (response["following"]) {
				update_followers(1)
				console.log(`Followed user with id: ${profile_id}`)
			} else {
				update_followers(-1)
				console.log(`Unfollowed user with id: ${profile_id}`)
			}
		})
}

function show_follow_button(following) {
	const btn = document.getElementById("follow-btn")
	if (following) {
		btn.classList.replace("btn-primary", "btn-secondary")
		btn.innerText = "Unfollow"
	} else {
		btn.classList.replace("btn-secondary", "btn-primary")
		btn.innerText = "Follow"
	}
}

function update_followers(increment) {
	const follower_count = document.getElementById("follower-count")
	follower_count.innerText = parseInt(follower_count.innerText) + increment
}