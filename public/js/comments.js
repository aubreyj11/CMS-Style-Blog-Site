async function commentFormHandler(event) {
    event.preventDefault();

    const commentText = document.querySelector('#user-comment').value.trim();
    const post_id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if(commentText) {
        const response = await fetch('/api/comments', {
            method: 'POST',
            body: JSON.stringify({
                post_id,
                commentText
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if(response.ok) {
            document.location.reload();
        } else {
            alert(response.statusText);
        };
    };
};

document.querySelector('.create-comment-form').addEventListener('submit', commentFormHandler);