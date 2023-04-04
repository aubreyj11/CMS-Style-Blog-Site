async function editFormHandler(event) {
    event.preventDefault();

    const title = document.querySelector('#post-title').value;
    const postText = document.querySelector('#post-text').value;
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length-1
    ];

    const response = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            title,
            postText
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        alert(response.statusText);
    }
}
document.querySelector('.update-post-form').addEventListener('submit', editFormHandler);