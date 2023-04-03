async function formHandler(event) {
    event.preventDefault();
    const title = document.querySelector('#post-title').value;
    const postText = document.querySelector('#post-text').value;

    const response = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify({
            title,
            postText
        }),
        headers: {
            'Content-Type' : 'application/json'
        }
    });
    if (response.ok) {
        document.location.replace('/dashboard');
    } else {
        alert(response.statusText);
    }
};

document.querySelector('.create-post-form').addEventListener('submit', formHandler);