const register = {
    template: `
  
        <div class="container py-5 ">
        <form enctype="multipart/form-data" id="reg" @submit.prevent="register">
            <div>
                <div class="card m-auto" style="width:40%;background-color:#FEF7EA">

                    <h2 class="m-3 mx-auto">Register Now</h2>
                    <div class="m-3">
                        <label for="username" class="form-label">Username</label>
                        <input type="text" class="form-control" name="username" id="username" placeholder="Username" v-model="formData.username" required>
                    </div>
                    <div class="m-3">
                        <label for="email" class="form-label">E-mail</label>
                        <input type="email" class="form-control" name="email" id="email" placeholder="e-mail" v-model="formData.email" required>
                    </div>

                    <div class="m-3">
                        <label for="password" class="form-label">Password</label>
                        <input type="password" class="form-control" name="password" id="password" placeholder="Password" v-model="formData.password" required>
                    </div>
                    <div class="m-3">
                        <label for="confirm password" class="form-label">Confirm password</label>
                        <input type="password" class="form-control" name="conf_password" id="conf_password" placeholder="Confirm Password" required>
                    </div>
                    <div class="form-outline m-3">
                        <label for="image" class="form-label">Upload image</label>
                        <input type="file" id="image" name="image" class="form-control" accept=".jpg, .png, .jpeg" required/>

                    </div>

                    <div class="mx-auto">
                        <button class="btn btn-success" type="submit">Register</button>
                    </div>
                    <div class="mb-3 mx-auto">
                    Already a member?<router-link to="/login">Log In</router-link>
                    </div>
                </div>
            </div>
            </form>
        </div>

    `,
    data() {
        return {
            formData: {
                username: '',
                password: '',
                email: ''
            }
        }
    },
    methods: {
        async register() {

            if (this.valid()) {
                const input = document.getElementById('image').files[0];
                const formData = new FormData();
                formData.append('image', input);
                formData.append('user', this.formData.username)

                const data = await fetch('/api/User', {
                    method: 'POST',
                    body: JSON.stringify(this.formData),
                    headers: { "Content-Type": "application/json" }
                })
                fetch('/register', {
                    method: 'POST',
                    body: formData

                })


                if (data.ok) {

                    return this.$router.push('/homepage')
                } else {
                    alert("Username already exists. Try a different username.")
                }



            }
        },
        valid() {

            var pass = document.getElementById("password").value
            var conf_pass = document.getElementById("conf_password").value
            var file = document.getElementById("image").value

            if (pass != conf_pass) {
                alert("Passwords doesn't match.")
                return false
            }

            if (file.indexOf(".") != -1) {
                var temp = file.split(".")
                if (['png', 'jpg', 'jpeg'].includes(temp[temp.length - 1])) {
                    return true
                }
            }
            alert("Upload valid profile image.")
            return false
        }
    }
}

export default register