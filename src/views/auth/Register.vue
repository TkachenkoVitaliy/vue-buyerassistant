<template>
  <div class='register_container'>
    <div>
      <img src='@/assets/steeleks_logo.png' class='logo'/>
    </div>
    <form
        name='form'
        v-if='!successful'
        @submit.prevent='handleRegister'
        class='login_form'
    >

      <div  class='input_container'>
        <label for='username'><strong class='text'>ЛОГИН</strong></label>
        <input
            v-model='user.username'
            v-validate="'required|min:3|max:20'"
            type='text'
            name='username'
            placeholder='Введите логин'
            class='input'
        />
        <div
            v-if="submitted && errors.has('username')"
            role='alert'
            class='alert text'
        >{{ errors.first('username') }}</div>
      </div>

      <div  class='input_container'>
        <label for='username'><strong class='text'>E-MAIL</strong></label>
        <input
            v-model='user.email'
            v-validate="'required|email|max:50'"
            type='email'
            name='email'
            placeholder='Введите email'
            class='input'
        />
        <div
            v-if="submitted && errors.has('email')"
            role='alert'
            class='alert text'
        >{{ errors.first('email') }}</div>
      </div>

      <div class='input_container'>
        <label for='password'><strong class='text'>ПАРОЛЬ</strong></label>
        <input
            v-model='user.password'
            v-validate="'required|min:6|max:40'"
            type='password'
            name='password'
            placeholder='Введите пароль'
            class='input'
        />
        <div
            v-if="submitted && errors.has('password')"
            role='alert'
            class='alert text'
        >{{ errors.first('password') }}
        </div>
      </div>

      <div class='register_btn_container'>
        <button
            v-bind:disabled='loading'
            class='register_btn'
        >
          <span>ЗАРЕГИСТРИРОВАТЬСЯ</span>
        </button>
      </div>

      <div>
        <div
            v-if='message'
            role='alert'
            :class="successful ? 'alert_success' : 'alert_danger'"
        >{{ message }}</div>
      </div>

      <div class='if_container'><span>или</span></div>

      <div class='login_btn_container'>
        <router-link
            to='/auth/login'
            class='login_btn'
            style='text-decoration: none; text-align: center'
        >
          <span>ВОЙТИ</span>
        </router-link>
      </div>

    </form>
  </div>

</template>

<script>
import User from '@/models/user'

export default {
  data() {
    return {
      user: new User('', '', ''),
      submitted: false,
      successful: false,
      message: ''
    }
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.status.loggedIn
    }
  },
  created() {
    if (this.loggedIn) {
      this.$router.push('/profile');
    }
  },
  methods: {
    handleRegister() {
      this.message = ''
      this.submitted = true
      this.$validator.validate().then(isValid => {
        if (isValid) {
          this.$store.dispatch('auth/register', this.user).then(
              data => {
                this.message = data.message
                this.successful = true
                this.$router.push('/auth/login');
              },
              error => {
                this.message =
                    (error.response && error.response.data) ||
                    error.message ||
                    error.toString()
                this.successful = false
              }
          )
        }
      })
    }
  }
}

</script>

<style scoped>
.register_container {
  height: 74vh;
  width: 20%;
  background-color: white;
  margin: 13vh auto;
  border: 4px #00689a solid;
  border-radius: 10px;
}

.login_form {
  padding: 20px;
}

.logo {
  display: block;
  margin: 0px auto;
  padding: 10px 0px;
  width: 243px;
  height: 72px;
}

.input_container {
  height: 96px;
  width: 220px;
  margin: 0px auto;
}

.input {
  padding-left: 10px;
  width: 220px;
  display: block;
  border: 2px #00689a solid;
  border-radius: 5px;
}

.if_container {
  text-align: center;
  margin: 10px 0px;
}

.login_btn_container {
}

.register_btn {
  display: block;
  margin: 0px auto;
  background-color: #00689a;
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
}

.login_btn {
  display: block;
  margin: 0px auto;
  background-color: white;
  color: #00689a;
  padding: 0px 20px;
  border-radius: 10px;
}

.alert {
  font-size: 12px;
  color: red;
}

.text {
  padding-left: 10px;
}

.alert_success {

}

.alert_danger {

}

</style>

