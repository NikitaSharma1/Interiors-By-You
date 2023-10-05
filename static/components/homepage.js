import navbar from "./navbar.js"

const homepage = {
    template: `
    <div>
    <div style="position: fixed;top: 0; width: 100%;z-index:1;">
    <navbar />
    </div>

    <div style="margin-top:120px">
    <div class="container mt-4">
        <div class="row justify-content-center">
            <div class="col-md-8">
                <div v-if="posts.length !=0 ">
                    <div class="card m-3" v-for="post in posts" style="background-color:#FEF9EE">
                        <div class="m-2 d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center">
                                <img :src="'/static/profile/'+ post.username +'.jpg'" width="40" height="40" style="border-radius: 50%;">
                                <router-link :to="{ path: '/search/' + post.username }"><button class="btn text-uppercase" style="border: none; padding:2px">{{ post.username }}</button></router-link>
                            </div>
                            <div class="mt-2">
                                <p style="color:grey">{{ post.timestamp }}</p>
                            </div>
                        </div>

                        <div>
                            <img class="card-img" v-bind:src="'/static/posts/'+ post.image +'.jpg'" style="border-radius:0">
                            <p class="card-title text-center" style="font-size: 20px;" v-html="post.title">{{ post.title }}</p>

                        </div>
                        <div class="card-text text-center">
                            <p class="lead" v-html="post.description">{{ post.description}}</p>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <div class="card m-3" style="background-color:#FEF9EE">
                        <h1 class="text-center m-5" style="color:grey">You don't follow anyone :(</h1>
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
            user: localStorage.getItem('username'),
            posts: [],
            redirect: ''
        }
    },
    methods: {
        async display() {
            const following_List = await fetch('/api/Follow/None/' + this.user)
            var following_list = await following_List.json()
            for (let i = 0; i < following_list.length; i++) {
                const post = await fetch('/api/Posts/' + following_list[i].followed)
                var posts = await post.json()
                for (let j = 0; j < posts.length; j++) {

                    const [month, day, year, hours, minutes, seconds] = posts[j].timestamp.split('_');
                    posts[j].timestamp = new Date(+year, +month - 1, +day, +hours, +minutes, +seconds).toLocaleString();
                    this.posts.push(posts[j])
                }
            }
            this.posts = this.posts.sort((a, b) => {
                return new Date(b.timestamp) - new Date(a.timestamp);
            });


        },
        profile() {
            return this.$router.push('/profile')
        }
    },
    mounted() {
        this.display();
    },
    async beforeCreate() {
        if (localStorage.getItem('login') === null) {
            return this.$router.push('/login')
        }


    }
}
export default homepage