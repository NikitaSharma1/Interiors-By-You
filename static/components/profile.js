import navbar from "./navbar.js"

const profile = {
    template: `
    <div>
    <navbar />
    <div class="mt-5 container w-75" style="background-color: #FEF7EA ; margin:0 auto; ">
    <div class="row">
    <div class="col-md-5">
        <div class="card mt-4" style="background-color:#FEF7EA; border:none">
            <img class="card-img-top img-fluid" v-bind:src="'/static/profile/'+ current_profile +'.jpg'"
                alt="Card image cap">
            <div class="card-body text-center">
                <h3 class="card-title">{{current_profile}}</h3>
                <div class="row mt-3">
                    <div class="col">
                        <h5>{{ this.posts.length }}</h5>
                        <button class="card-link btn" style="text-decoration: none; color: #3A3A3A;
                            font-size:18px; font-family: system-ui;" @click="Post()">Posts</button>
                    </div>
                    <div class="col">
                        <h5>{{this.follower_list.length}}</h5>
                        <button class="card-link btn" style="text-decoration: none; color: #3A3A3A;
                            font-size:18px; font-family: system-ui;" @click="page = 'follower'">Followers</button>
                    </div>
                    <div class="col">
                        <h5>{{ this.following_list.length }}</h5>
                        <button class="card-link btn" style="text-decoration: none; color: #3A3A3A;
                            font-size:18px; font-family: system-ui;" @click="page = 'following'">Following</button>
                    </div>
                </div>
                <div class="row mt-3 mx-auto">
                    <div class="col">
                        <button class="btn btn-outline-success btn-block" @click="page='update_profile'">Update
                            Profile</button>
                    </div>
                    <div class="col">
                        <button class="btn btn-outline-danger btn-block" @click="Delete()">Delete
                            Account</button>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div class="col-md-7 mt-3">
    <div class="container" style="height:75vh;overflow-y:scroll;">
  
      <div v-if="page == 'post'" class="container w-90">
        <button id="create" name="create" class="btn btn-outline-danger mb-3" @click="page='create'">Create Post</button>
        <div class="m-5" style="text-align: center; color:grey" v-if="posts.length == 0">
          <h1>No posts yet :(</h1>
        </div>
        <div v-if="posts.length != 0" v-for="post in posts">
          <div class="card mt-3 mb-4" style="background-color:#FEF7EA">
          <div class="row m-2 flex-wrap">
          <div class="col-6 col-md-1 mb-2 mb-md-0 me-3">
            <button class="btn btn-outline-dark"><i class="bi bi-pencil-square" @click="current_post = post; page = 'update'"></i></button>
          </div>
          <div class="col-6 col-md-2">
            <button @click="Delete_post(post)" type="button" class="btn btn-outline-danger"><i class="bi bi-trash3"></i></button>
          </div>
        </div>
        
            <div style="text-align:center">
              <div>
                <img class="card-img-top " v-bind:src="'/static/posts/'+ post.image +'.jpg'" alt="Card image cap">
              </div>
              <div class="card-body m-auto">
                <h4 class="card-title" v-html="post.title">{{ post.title}}</h4>
              </div>
              <div>
                <p v-html="post.description">{{ post.description}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
  
  


                    <div v-if="page == 'follower'">
                        <div class="card mb-2 container w-75 border-0" style="background-color:#FEF7EA">
                            <h1 class="display-4">Followers</h1><br>
                            <div class="card-body row" v-for="follower in follower_list">
                                <div>
                                    <img :src="'/static/profile/'+ follower +'.jpg'" width="45" height="45" style="border-radius: 50%;">
                                    <router-link :to="{ path: '/search/' + follower }"><button class="btn" style="border: none;">{{ follower }}</button></router-link>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div v-if="page == 'following'">
                        <div class="card mb-2 container w-75 border-0" style="background-color:#FEF7EA">
                            <h1 class="display-4">Following</h1><br>
                            <div class="card-body row" v-for="following in following_list">
                                <div>
                                    <img :src="'/static/profile/'+ following +'.jpg'" width="45" height="45" style="border-radius: 50%;">
                                    <router-link :to="{ path: '/search/' + following }"><button class="btn" style="border: none;" >{{ following }}</button></router-link>
                                </div>
                            </div>
                        </div>
                    </div>


                    <div v-if="page == 'create'">
                        <form class="container w-75" enctype=multipart/form-data @submit.prevent="Create">

                            <h1 class="display-4">Create Post</h1>

                            <br>
                            <div class="form-outline mb-4">
                                <label class="form-label" for="title">Title</label>
                                <input type="text" id="title" name='title' class="form-control" required/>
                            </div>

                            <div class="form-outline mb-4">
                                <label class="form-label" for="description">Description</label>
                                <textarea class="form-control" id="description" name='description' rows="4" required></textarea>
                            </div>
                            <div class="form-outline mb-4">
                                <label for="image" class="form-label">Upload image</label>
                                <input type="file" id="post" name='post' class="form-control" required/>
                            </div>

                            <button type="submit" class="btn btn-outline-success">Post</button>
                            <button id="cancel" name="cancel" class="btn btn-outline-danger" @click="Post">Cancel</button>
                        </form>

                    </div>




                    <div v-if="page == 'update'">
                        <form class="container w-75" enctype=multipart/form-data @submit.prevent='Update'>

                            <h1 class="display-4">Update Post</h1>

                            <br>
                            <div class="form-outline mb-4">
                                <label class="form-label" for="title">Title</label>
                                <input type="text" id="title_up" name='title' class="form-control" :value="current_post.title" required />
                            </div>

                            <div class="form-outline mb-4">
                                <label class="form-label" for="description">Description</label>
                                <textarea class="form-control" id="description_up" name='description' rows="4" :value="current_post.description" required></textarea>
                            </div>
                            <div class="form-outline mb-4">
                                <label for="image" class="form-label">Upload image</label>
                                <input type="file" id="post_up" name='post' class="form-control" />
                            </div>

                            <button type="submit" class="btn btn-outline-success">Post</button>
                            <button id="cancel" name="cancel" class="btn btn-outline-danger" @click="Post">Cancel</button>
                        </form>

                    </div>


                    <div v-if="page == 'update_profile'">
                        <form class="container w-75" enctype=multipart/form-data @submit.prevent='UpdateProfile'>

                            <h1 class="display-4">Update Profile</h1>

                            <div class="form-outline mb-3">
                                <label for="username" class="form-label">Username</label>
                                <input type="text" class="form-control" name="username" id="username" :value="user.username" disabled />
                            </div>

                            <div class="form-outline mb-3">
                                <label for="email" class="form-label">E-mail</label>
                                <input type="email" class="form-control" name="email" id="email" :value="user.email" required>
                            </div>

                            <div class="form-outline mb-3">
                                <label for="password" class="form-label">Password</label>
                                <input type="password" class="form-control" name="password" id="password" placeholder="Password" required>
                            </div>

                            <div class="form-outline mb-3">

                                <label for="confirm password" class="form-label">Confirm password</label>
                                <input type="password" class="form-control" name="conf_password" id="conf_password" placeholder="Confirm Password" required>
                            </div>

                            <div class="form-outline mb-3">
                                <label for="profileImage" class="form-label">Update profile pic</label>
                                <input type="file" id="profileImage" name='post' class="form-control" />
                            </div>

                            <button type="submit" class="btn btn-outline-success">Update</button>
                            <button id="cancel" name="cancel" class="btn btn-outline-danger" @click="Post">Cancel</button>
                        </form>

                    </div>

                </div>
            </div>
        </div>

    </div>
</div>
</div>
    `,
    components: { 'navbar': navbar },
    data() {
        return {

            current_profile: localStorage.getItem('username'),
            page: '',
            current_post: {},
            posts: [],
            follower_list: [],
            following_list: [],
            createpost: {
                username: localStorage.getItem('username'),
                title: '',
                description: '',
                image: '',
                timestamp: ''

            },
            user: {
                username: '',
                password: '',
                email: ''
            }
        }
    },

    methods: {
        async Post() {
            const temp = await fetch('/api/Posts/' + this.current_profile)
            const user = await fetch('/api/User/' + this.current_profile)
            const following_List = await fetch('/api/Follow/None/' + this.current_profile)
            const follower_List = await fetch('/api/Follow/' + this.current_profile + '/None')

            var follower_list = await follower_List.json()
            var following_list = await following_List.json()
            this.posts = await temp.json()
            this.user = await user.json()
            this.follower_list = []
            this.following_list = []
            for (let i = 0; i < follower_list.length; i++) {
                this.follower_list.push(follower_list[i].follower)
            }
            for (let i = 0; i < following_list.length; i++) {
                this.following_list.push(following_list[i].followed)
            }

            if (localStorage.getItem('username') != this.current_profile) {
                this.myprofile = false
            } else {
                this.myprofile = true
            }

            if (this.myprofile == false) {
                if (this.follower_list.includes(localStorage.getItem('username'))) {
                    this.follow = true
                } else {
                    this.follow = false
                }
            }

            this.page = 'post'

        },

        async Create() {
            var filename = document.getElementById('post').value
            if (this.check(filename)) {

                const file = document.getElementById('post').files[0]

                var date = new Date().toLocaleString('en-IT', { hour12: false }).slice(0, 17).replace(' ', '').replace(/[\/, :]/g, "_")
                console.log(date)
                this.createpost.timestamp = date

                // this.createpost.timestamp = date.toISOString().slice(0, 19).replace(/-|T|:/g, "_")
                this.createpost.title = document.getElementById('title').value
                this.createpost.description = document.getElementById('description').value
                this.createpost.image = this.user.username + this.createpost.timestamp

                const formData = new FormData();
                formData.append('image', file);
                formData.append('imagename', this.createpost.image)

                const data = await fetch('/api/Posts', {
                    method: 'POST',
                    body: JSON.stringify(this.createpost),
                    headers: { "Content-Type": "application/json" }
                })

                fetch('/create', {
                    method: 'POST',
                    body: formData
                })

                if (data.ok) {
                    this.Post()
                }
            } else {

                alert("Upload valid image.")

            }
        },


        async Update() {

            var filename = document.getElementById('post_up').value

            if (filename != '') {
                if (this.check(filename)) {
                    const file = document.getElementById('post_up').files[0]
                    const formData = new FormData()
                    formData.append('image', file)
                    formData.append('imagename', this.current_post.image)

                    fetch('/create', {
                        method: 'POST',
                        body: formData
                    })
                } else {
                    alert("Upload valid image")
                }
            }

            var update = {
                post_id: this.current_post.post_id,
                title: document.getElementById('title_up').value,
                description: document.getElementById('description_up').value
            }

            const data = await fetch('/api/Posts', {
                method: 'PUT',
                body: JSON.stringify(update),
                headers: { "Content-Type": "application/json" }
            })

            if (data.ok) {
                location.reload()
            }


        },

        async Delete_post(post) {

            if (confirm("Do you really want to delete this post?")) {
                const temp = await fetch('/delete_post', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 'image': post.image })
                })

                if (temp.ok) {
                    const del = await fetch('/api/Posts/post/' + post.post_id, {
                        method: 'DELETE'
                    })
                    if (del.ok) {
                        alert('Post successfully deleted!')
                        this.Post()
                    } else {
                        alert('Something went wrong!')
                    }
                }
            }
        },

        async UpdateProfile() {
            var profileImage = document.getElementById('profileImage').value
            if (profileImage == '' || this.check(profileImage)) {

                const temp = await fetch('/api/User/' + this.user.username)
                const data = await temp.json()

                var pass = document.getElementById("password").value
                var conf_pass = document.getElementById("conf_password").value
                var email = document.getElementById("email").value

                if (pass == conf_pass) {
                    this.user.password = pass
                    this.user.email = email


                    if (profileImage != '') {
                        const file = document.getElementById('profileImage').files[0]
                        const formData = new FormData()
                        formData.append('image', file)
                        formData.append('user', this.user.username)

                        fetch('/register', {
                            method: 'POST',
                            body: formData
                        })
                    }
                    const update = await fetch('/api/User', {
                        method: 'PUT',
                        body: JSON.stringify(this.user),
                        headers: { "Content-Type": "application/json" }
                    })

                    if (update.ok) {
                        location.reload()
                    }
                } else {
                    alert("Passwords doesn't match.")

                }

            } else {
                alert('Upload valid profile picture')
            }
        },

        async Delete() {
            if (confirm('Are you sure you want to delete your account?')) {
                const temp = await fetch('/delete', {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ 'username': localStorage.getItem('username') })
                })
                if (temp.ok) {
                    const del = await fetch('/api/User/' + localStorage.getItem('username'), {
                        method: 'delete'
                    })
                    if (del.ok) {
                        alert('We are sorry to let you go :(')

                        window.localStorage.clear()
                        location.reload()
                    } else {
                        alert('Something went wrong')
                    }
                } else {
                    alert('Something went wrong')
                }
            }
        },

        check(filename) {

            if (filename.indexOf(".") != -1) {
                var temp = filename.split(".")
                if (['png', 'jpg', 'jpeg'].includes(temp[temp.length - 1])) {
                    return true
                }
            }
            return false

        },

    },


    async beforeCreate() {
        if (localStorage.getItem('login') === null) {
            return this.$router.push('/login')
        }

    },
    mounted() {
        this.Post()
    }
}

export default profile