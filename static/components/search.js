import navbar from "./navbar.js"

const search = {
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
                    <div style="margin:0 auto">
                        <button class="btn btn-danger mt-3" v-if='follow' @click="Follow()">Unfollow</button>
                        <button class="btn btn-success mt-3" v-else @click='Follow()'>Follow</button>
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
                                <h1 class="display-3">Followers</h1><br>
                                <div class="card-body row" v-for="follower in follower_list">
                                    <div>
                                        <img :src="'/static/profile/'+ follower +'.jpg'" width="45" height="45" style="border-radius: 50%;">
                                        <button class="btn" style="border: none;" @click="current_profile=follower; Post()">{{ follower }}</button>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div v-if="page == 'following'">
                            <div class="card mb-2 container w-75 border-0" style="background-color:#FEF7EA">
                                <h1 class="display-3">Following</h1><br>
                                <div class="card-body row" v-for="following in following_list">
                                    <div>
                                        <img :src="'/static/profile/'+ following +'.jpg'" width="45" height="45" style="border-radius: 50%;">
                                        <button class="btn" style="border: none;" @click="current_profile=following;Post()">{{ following }}</button>
                                    </div>
                                </div>
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

            current_profile: this.$route.params.user,
            page: '',
            follow: '',
            posts: [],
            follower_list: [],
            following_list: [],
        }
    },

    methods: {
        async Post() {
            if (this.current_profile == localStorage.getItem('username')) {
                return this.$router.push('/profile')
            } else {
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

                if (this.follower_list.includes(localStorage.getItem('username'))) {
                    this.follow = true
                } else {
                    this.follow = false
                }
                this.page = 'post'
            }

        },

        async Follow() {

            const temp = await fetch('/api/Follow/' + this.current_profile + '/' + localStorage.getItem('username'), {
                method: 'POST'
            })
            this.Post()
        },
    },
    async beforeCreate() {
        if (localStorage.getItem('login') === null) {
            return this.$router.push('/login')
        }

    },
    mounted() {
        this.current_profile = this.$route.params.user
        this.Post()
    }
}

export default search