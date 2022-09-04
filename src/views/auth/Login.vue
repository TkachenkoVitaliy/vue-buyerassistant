<template>
  <div class='login_container'>
    <div>
      <img src='@/assets/steeleks_logo.png' class='logo'/>
    </div>
    <form name='form' @submit.prevent='handleLogin' class='login_form'>

      <div  class='input_container'>
        <label for='username'><strong class='text'>ЛОГИН</strong></label>
        <input
            v-model='user.username'
            v-validate="'required'"
            type='text'
            name='username'
            placeholder='Введите логин'
            class='input'
        />
        <div
            v-if="errors.has('username')"
            role='alert'
            class='alert text'
        >Заполните поле - Логин</div>
      </div>

      <div class='input_container'>
        <label for='password'><strong class='text'>ПАРОЛЬ</strong></label>
        <input
            v-model='user.password'
            v-validate="'required'"
            type='password'
            name='password'
            placeholder='Введите пароль'
            class='input'
        />
        <div
            v-if="errors.has('password')"
            role='alert'
            class='alert text'
        >Заполните поле - Пароль
        </div>
      </div>

      <div class='login_btn_container'>
        <button
            v-bind:disabled='loading'
            class='login_btn'
        >
          <span v-show='loading'></span>
          <span>ВОЙТИ</span>
        </button>
      </div>

      <div class='if_container'><span>или</span></div>

      <div class='register_btn_container'>
        <router-link
            to='/auth/register'
            class='register_btn'
            style='text-decoration: none'
        >
          <p style='text-align: center'>ЗАРЕГИСТРИРОВАТЬСЯ</p>
        </router-link>
      </div>

    </form>

    <div v-if='message' role='alert' class='alert_message'>{{ message }}</div>

  </div>

</template>

<script>
  import User from '@/models/user'

  export default {
    data() {
      return {
        user: new User('', ''),
        loading: false,
        message: ''
      }
    },
    computed: {
      loggedIn() {
        return this.$store.state.auth.status.loggedIn
      }
    },
    created() {
      if(this.loggedIn) {
        this.$router.push('/settings')
      }
    },
    methods: {
      handleLogin() {
        this.loading = true
        this.$validator.validateAll().then(isValid => {
          if (!isValid) {
            this.loading = false
            return
          }
          if (this.user.username && this.user.password) {
            this.$store.dispatch('auth/login', this.user).then(
                () => {
                  this.$router.push('/settings')
                },
                error => {
                  this.loading = false
                  this.message =
                      (error.response && error.response.data) || error.message ||
                      error.toString()
                }
            )
          }
        })
      }
    }
  }

</script>

<style scoped>
  .login_container {
    height: 60vh;
    width: 20%;
    background-color: white;
    margin: 20vh auto;
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
    height: 86px;
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
    margin-top: 10px;
  }

  .login_btn {
    display: block;
    margin: 0px auto;
    background-color: #00689a;
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
  }

  .register_btn {
    display: block;
    margin: 0px auto;
    background-color: white;
    color: #00689a;
    padding: 0px 20px;
    border-radius: 10px;
  }

  .alert {
    color: red;
  }

  .text {
    padding-left: 10px;
  }

  .alert_message {
    background-color: white;
    font-size:20px;
    position: absolute;
    top: 0;
    left: 0;
    color: red;
  }

</style>