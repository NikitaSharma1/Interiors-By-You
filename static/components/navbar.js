const navbar = {
    template: `
    <nav class="navbar navbar-expand-lg" style="background-color: #F8F1E4;">
    <div class="container-fluid d-flex justify-content-between align-items-center w-75">
      <a class="navbar-brand" href="#">
        <img src="/static/logo.png" width="200" height="70" alt="InteriorsByYou">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <form class="d-flex form-inline my-2 my-lg-0 mx-auto" @submit.prevent="search">
          <div class="input-group">
            <input type="text" class="form-control" id="search" name="search" placeholder="Username" aria-label="Username" aria-describedby="basic-addon1" style="background-color: #F8F1E4" required>
            <button type="submit" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#modalid" style="background-color: #F8F1E4"><i class="bi bi-search"></i></button>
          </div>
        </form>
        <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <button class="btn nav-link" style="border: none;" @click='homepage()'>HOME</button>
          </li>
          <li class="nav-item">
            <button class="btn nav-link" style="border: none;" @click='profile()'>MY ACCOUNT</button>
          </li>
          <li class="nav-item">
            <button class="btn nav-link" style="border: none;" @click="logout()">LOG OUT</button>
          </li>
          <li class="nav-item">
            <button class="btn nav-link" style="border: none;" @click="exportdata()">EXPORT</button>
          </li>
        </ul>
        
      </div>
    </div>
  

            <div class="modal fade" id="modalid" tabindex="-1" aria-labelledby="ModalLabel" aria-hidden="true" data-bs-backdrop="false">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Search Results</h5>
                        </div>
                        <div class="modal-body">
                            <div class="card mb-2 container border-0">
                            <div  v-if="res.length != 0">
                                <div class="card-body row" v-for="user in res">
                                    <div>
                                        <img :src="'/static/profile/'+ user.username +'.jpg'" width="45" height="45" style="border-radius: 50%;">
                                        <button class="btn" style="border: none;" @click="searchuser(user.username)">{{ user.username }}</button>
                                    </div>
                                </div>
                                </div>
                                <div class="card-body row" v-else>
                                    <p>No Results Found</p>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </nav>
    `,
    data() {
        return {
            res: []
        }
    },

    methods: {
        async logout() {
            if (confirm('Are you sure you wanna log out?')) {
                const res = await fetch('/logout', { method: 'GET' })
                const data = await res.json()
                if (res.ok) {
                    window.localStorage.clear()
                    alert(data)
                    return this.$router.push('/login')
                }
            }
        },

        async search() {
            var user = document.getElementById('search').value
            fetch('/api/search/' + user).then(res => res.json()).then(data => {
                this.res = data
            })


        },
        searchuser(user) {
            this.$router.push("/search/" + user)
            location.reload()
        },
        profile() {
            this.$router.push("/profile")
        },
        homepage() {
            this.$router.push("/homepage")
        },
        exportdata() {
            fetch('/export').then(res => {
                if (res.ok) {
                    alert("Exported Successfully!! Now wait for another 15 seconds to export again.")
                } else {
                    alert("Export Failed")
                }
            })
        }
    }
}

export default navbar