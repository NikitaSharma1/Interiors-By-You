const login = {
    template: `
    <div class="container" style="height: 100vh; align-items:center; display:flex; justify-content:center;">
        <div style="width: 25rem;">
            <div class="card container-50" style="background-color:#FEF7EA">
            <form action="" method="POST" @submit.prevent='loginUser'>
                <h2 class="m-4 text-center">Log IN</h2>
                <div class="m-3">
                    <label for="username" class="form-label">Username</label>
                    <input type="text" class="form-control" name="username" id="username" placeholder="Username"
                        v-model="formData.username" required>
                </div>
                <div class="m-3">
                    <label for="password" class="form-label">Password</label>
                    <input type="password" class="form-control" name="password" id="password" placeholder="Password"
                        v-model="formData.password" required>
                </div>
                <div class="m-3 text-center">
                    <button class="btn btn-success" type="submit" >Login</button>
                </div>
                <div class="m-3 text-center">
                    <p>Not a user?<router-link to="/register"> Register here.</router-link></p>
                </div>
                </form>
            </div>
        </div>
    </div>

    `,
    data() {
        return {
            formData: {
                username: "",
                password: ""
            }
        }
    },
    methods: {
        async loginUser() {
            if (this.valid()) {
                const temp = await fetch('/login', {
                    method: "post",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(this.formData)
                })
                const data = await temp.json()
                if (temp.ok) {
                    // Purpose of storing data in local storage 
                    //and where and why to use it
                    localStorage.setItem('username', this.formData.username);
                    localStorage.setItem('login', true);
                    return this.$router.push('/homepage')
                } else {
                    alert(data.message)
                }
            }
        },

        valid() {
            var username = document.getElementById("username").value
            var password = document.getElementById("password").value
            if (/ /.test(password) || / /.test(username)) {
                alert("Please remove space from username/password")
                return false
            }
            return true
        }
    }
}

// exporting login to use in application
export default login