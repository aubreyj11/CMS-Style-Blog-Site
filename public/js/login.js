async function loginHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#login-username').value.trim();
    const password = document.querySelector('#login-pw').value.trim();

    if(username && password) {
        const response = await fetch('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password 
            }),
            headers: {'Content-Type': 'application/json'}
        });

        if(response.ok) {
            document.location.replace('/dashboard');
        } else {
            console.log(await response.json());
            alert(response.statusText);
        }
    }

};

async function signupHandler(event) {
    event.preventDefault();

    const username = document.querySelector('#create-username').value.trim();
    const password = document.querySelector('#create-pw').value.trim();

    if(username && password) {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {'Content-Type': 'application/json'}
        });

        if(response.ok) {
            alert('New user has been created! You can now log in.')
        } else {
            alert(response.statusText);
        }
    }
}

document.querySelector('.login-form').addEventListener('submit', loginHandler);
document.querySelector('.new-acc-form').addEventListener('submit', signupHandler);