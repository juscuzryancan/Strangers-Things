const BASE_URL = 'https://strangers-things.herokuapp.com/api/2006-CPU-RM-WEB-PT' 

const state = {
    allPosts: [],
    userPosts: [],
    userMessages: [],
    username: '',
    response: {},
    postID: '',
    isAllPostsClicked: true,
    isUserPostsClicked: false,
    isUserMessagesClicked: false,
    sortOption: 'newest'
};

const register = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/users/register`, {
            method: 'POST',
            headers: makeHeaders(),
            body: JSON.stringify({
                user: {
                    username: username,
                    password: password
                }
            })
        });
        state.response = await response.json();
        if(state.response.success){
            localStorage.setItem('token', state.response.data.token);
        }
    } catch (error) {
        console.error(error);
    }
}

const logIn = async (username, password) => {
    try {
        const response = await fetch(`${BASE_URL}/users/login`, {
            method: 'POST',
            headers: makeHeaders(),
            body: JSON.stringify({
                user: {
                    username: username,
                    password: password
                }
            })
        });
        state.response = await response.json();
        if (state.response.success) {
            localStorage.setItem('token', state.response.data.token);
        }
    } catch (error) {
        console.error(error);
    }
}

const logOut = () => {
    localStorage.removeItem('token');
    console.log('you logged out');
}

const isLoggedIn = () => {
    return (localStorage.getItem('token'));
}

const fetchAllPosts = async () => {
    try {
        const response = await fetch(`${BASE_URL}/posts`, {headers: makeHeaders()});
        state.response = await response.json();
        state.allPosts = state.response.data.posts;
    } catch (error) {
        console.error(error);
    }
}

const fetchUser = async () => {
    try {
        const response = await fetch(`${BASE_URL}/users/me`, {
            headers: makeHeaders()
        });
        state.response = await response.json();
        state.userPosts = state.allPosts.filter((post) => post.isAuthor);
        state.userMessages = state.response.messages;
        state.username = state.response.username;
    } catch (error) {
        console.error(error);
    }
}

const createPost = async (post) => {
    try {
        const response = await fetch(`${BASE_URL}/posts`, {
            method: "POST",
            headers: makeHeaders(),
            body: JSON.stringify({post})
        });
        state.response = await response.json();
        console.log(state.response);
    } catch (error) {
        console.error(error);
    }
}

const updatePost = async (postID, post) => { 
    try {
        const response = await fetch(`${BASE_URL}/posts/${postID}`, {
            method: "PATCH",
            headers: makeHeaders(),
            body: JSON.stringify({post})
        });
        state.response = await response.json();
    } catch (error) {
        console.error(error);
    }
}


const deletePost = async (postID) => {
    try {
        const response = await fetch(`${BASE_URL}/posts/${postID}`, {
            method: "DELETE",
            headers: makeHeaders()
        });
        state.response = await response.json();
    } catch (error) {
        console.error(error);
    }
}

const createMessage = async (postID, content) => {
    try {
        const response = await fetch(`${BASE_URL}/posts/${postID}/messages`, {
            method: "POST",
            headers: makeHeaders(),
            body: JSON.stringify({message: {content} })
        });
    } catch (error) {
        console.error(error);
    }
}

//helper functions
const makeHeaders = () => {
    const token = localStorage.getItem('token');
    if (token) {
        return {'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`};
    } else {
        return {'Content-Type': 'application/json'};
    }
}

//render funcitons
//render the whole entire website from start
//a base render function
const bootstrap = async () => {
    //instead of making elements one by one just template all of them 
    //in one go. then this way you're able to just select each one
    try {
        if(isLoggedIn()){
            await fetchUser();
        }
        await fetchAllPosts(); 
    } catch (error) {
        console.error(error);
    }
    document.querySelector('#app').innerHTML = 
        `<nav id='side-nav'> 
            <header id='home-header'> 
                <a href='index.html'>Stranger's Things</a>
                ${ (isLoggedIn()) ?
                    `<p> Welcome, ${state.username} </p>
                    <button id="create-post-popup">Create Post</button>` :
                    '<button id="log-in-popup">Log in</button>' 
                }
            </header>
            ${ (isLoggedIn()) ?
                `<div id='side-buttons'>
                    <button id='all-posts'>All Posts</button>
                    <button id='my-posts'>My Posts</button>
                    <button id='my-messages'>My Messages</button>
                </div> 
                <footer>
                    <button id='log-out'> Log Out </button>
                </footer>` : ''}
        </nav>
        <main>
            ${ (state.isAllPostsClicked || state.isUserPostsClicked) ? 
            `<div id='timeline'>
                <label for='search-filter'>Search</label>
                <input id='search-filter'></input>
                <div id='options'>
                    <div>
                        <p>View</p>
                        <button></button>
                        <button></button>
                        <button></button>
                    </div>
                    <div>
                        <label for='sort'>Sort By</label>
                        <select name='sort-selection' id='sort'>
                            <option value='newest'>Newest</option>
                            <option value='oldest'>Oldest</option>
                            <option value='recently-updated'>Recently Updated</option>
                            <option value='closest'>Closest</option>
                        </select>
                    </div>
                </div>
                <div id='posts'></div>` : ''}
            </div>
            ${ (state.isUserMessagesClicked) ?
                `<div id='messages'>
                </div>` : ''}
        </main>
        <div id='log-in-form-container' class='inactive'>
            <div id='log-in-form'>
                <span id='log-in-form-message'>Welcome!</span>
                <span>If you are not a registered user, 
                Please enter a username and password with at least 8 characters</span>
                <label for='username'>Username</label>
                <input id='username' type='text'></input>
                <label for='password'>Password</label>
                <input id='password' type='password'></input>
                <button id='log-in-button' type='click'>Log In</button>
                <button id='register-button' type='click'>Register</button>
            </div>
        </div>
        <div id='create-post-form-container' class='inactive'>
            <div id='create-post-form'>
                <span id='log-in-form-message'>Create A Post</span>
                <label for='title'>Title</label>
                <input id='title' type='text' required></input>
                <label for='description'>Description</label>
                <input id='description' type='text' required></input>
                <label for='price'>Price</label>
                <input id='price' type='text' required></input>
                <label for='location'>Location</label>
                <input id='location' type='text'></input>
                <label for='will-deliver'>Will You Deliver</label>
                <input id='will-deliver' type='checkbox'></input>
                <button id='create-post-button' type='click'>Submit</button>
            </div>
        </div>
        <div id='send-message-form-container' class='inactive'>
            <div id='create-post-form'>
                <span id='sending-a-message'>Sending A Message</span>
                <label for='content'>Message</label>
                <input id='content' type='text'></input>
                <button id='message-button' type='click'>Submit</button>
            </div>
        </div>
        `;
    //try to append event listeners here right after the html is setup
    renderPosts(state.allPosts);
}


//unfinished
//needs to be templated correctly with edit buttons
const renderPost = (post) => {
    const {_id,
        author: {username}, 
        description, 
        isAuthor,
        location,
        messages, 
        createdAt,
        updatedAt, 
        title,
        price,
        willDeliver} = post;
    const postElement = document.createElement('div');
    postElement.setAttribute('postID', _id);
    postElement.className = 'post'
    postElement.innerHTML = 
        `<div>
            <h3> Title: ${title}${(isAuthor && isLoggedIn()) 
            ? `<img src="more.svg" id='more-image'>
            <div class='more-menu'>
                <button id='edit'>Edit</button>
                <button id='delete'>Delete</button>
            </div>` : ''}</h3> 
            <h4> Price: ${price} </h4>
            <div>Description: ${description}</div>
            <div>Location: ${location}</div>
            <div>Will Deliver: ${willDeliver}</div>
            <div>Created At: ${createdAt}</div>
            <div>Updated At: ${updatedAt}</div> 
            <footer>User: ${username} ${(!isAuthor && isLoggedIn()) ?  `<img src="message.svg" id='message-image'>`: ''} </footer>
        </div>`;
    return postElement;
}

//change where this will get rendered
const renderPosts = (posts) => {
    if(state.isAllPostsClicked && (state.sortOption = 'newest')){
        posts.forEach( (post) => {
            document.querySelector('#posts').prepend(renderPost(post));
        });
    } else if (state.isUserPostsClicked) {
    }
}


//Event Listeners
document.addEventListener('click', async (event) => {
    const element = event.target;
    console.log(event.target);

    //logout even listener
    if(element.matches('#log-out')){
        localStorage.removeItem('token');
        state.userPosts = []
        state.userMessages = [];
        state.response = {};
        state.isAllPostsClicked = true;
        bootstrap();
    }
    
    //login popup
    if(element.matches('#log-in-popup')){
        document.getElementById('log-in-form-container').classList.toggle('inactive');
    }

    //login button click
    if(element.matches('#log-in-button')){
        try {
            const username = document.querySelector('#username').value;
            const password = document.querySelector('#password').value;
            await logIn(username, password);
            fetchUser();
            if(state.response.success){
                document.getElementById('log-in-form-container').classList.toggle('inactive');
                bootstrap();
            }
        } catch (error) {
            console.error(error);
        } finally {
        }
    }

    if(element.matches('#register-button')){
        try {
            const username = document.querySelector('#username').value;
            const password = document.querySelector('#password').value;
            await register(username, password);
            if(state.response.success){
                document.getElementById('log-in-form-container').classList.toggle('inactive');
                bootstrap();
            }
        } catch (error) {
            console.error(error);
        } finally {
        }
    }

    if(element.matches('#create-post-popup')){
        document.getElementById('create-post-form-container').classList.toggle('inactive');
    }
    
    if(element.matches('#create-post-button')){
        try{
            const postObj = {
                title: document.getElementById('title').value,
                description: document.getElementById('description').value,
                price: document.getElementById('price').value,
                location: document.getElementById('location').value,
                willDeliver: document.getElementById('will-deliver').checked
            }
            await createPost(postObj);

            if(state.response.success){
                document.getElementById('create-post-form-container').classList.toggle('inactive');
                bootstrap();
            }
        } catch (error) {
            console.error(error);
        } finally {
        }
    }

    if(element.matches('#more-image')){
        state.postID = element.closest('.post').getAttribute('postid');
        
    }

    if(element.matches('#message-image')){
        document.getElementById('send-message-form-container').classList.toggle('inactive');
        state.postID = element.closest('.post').getAttribute('postid');
    }

    if(element.matches('#message-button')){
        const content = document.getElementById('content').value;
        try {
            await createMessage(state.postID, content);
        } catch (error) {
            console.error(error);
        }

        if(state.response.success){
            document.getElementById('send-message-form-container').classList.toggle('inactive');
        }
    }
     
    if(element.matches('#delete')) {
        state.postID = element.closest('.post').getAttribute('postid');
        try {
            await deletePost(state.postID);
        } catch (error) {
            console.error(error);
        }
        if(state.response.success) {
            await fetchAllPosts();
            renderPosts(state.allPosts);
        }
    }


});

document.addEventListener('input', (event) => {
    if(event.target.matches('#search-filter')){
        document.getElementById('posts').innerHTML = '';

        const keyword = event.target.value;
        if(keyword === '') {
            renderPosts(state.allPosts);
            return;
        }

            const filteredPosts = state.allPosts.filter((post) => {

                const {_id,
                    author: {username}, 
                    description, 
                    location,
                    title,
                    price} = post;

                if(username.toLowerCase().includes(keyword.toLowerCase()) || 
                    description.toLowerCase().includes(keyword.toLowerCase()) ||
                    location.toLowerCase().includes(keyword.toLowerCase()) ||
                    title.toLowerCase().includes(keyword.toLowerCase()) ||
                    price.toLowerCase().includes(keyword.toLowerCase())){
                    return true;
                }
            });

        renderPosts(filteredPosts);
    }
})
//main
//todo 
//change distribution of event handling, try and add each function
//swap to components so each comp has a render of its own
//swap certain click handlers to form submits
//through independent event Listeners.
//this way we can easily read each individual function and for ease of maintenance
//make sure we update the format specifically through the state of the site
//we'll add more formatting at the end of adding functionality
bootstrap();
