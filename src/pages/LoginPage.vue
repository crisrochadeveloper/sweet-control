<template>
  <q-page class="w-full h-full flex flex-col justify-end"
    style="background-image: url('/imgs/bg.png');background-position: center center;background-size: cover;">
    <transition enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
      <q-card v-if="show == 'login'" class="w-[98%] max-w-[700px] mx-auto">
        <q-card-section header class="w-full flex gap-2 items-center">
          <q-avatar size="sm">
            <q-img src="/imgs/logo-2.png" />
          </q-avatar>
          <h2 class="leading-3 uppercase text-pink-6 font-extrabold text-2xl">Sweet Control</h2>
        </q-card-section>
        <q-card-section>
          <q-form class="w-full flex flex-col gap-4 items-start" @submit.prevent="login">
            <p>Olá, digite seus dados de acesso</p>
            <q-input class="w-full" v-model="email" outlined label-color="pink-6" color="pink-6" required type="email"
              label="Seu Email" />
            <q-input class="w-full" v-model="password" outlined label-color="pink-6" color="pink-6" required
              :type="type" label="Sua Senha">
              <template #append>
                <q-btn round dense flat color="pink-6" :icon="type == 'password' ? 'visibility_off' : 'visibility'"
                  @click="type = type == 'password' ? 'text' : 'password'" />
              </template>
            </q-input>
            <q-btn @click="changeComponentToRecover" no-caps label="Esqueci minha senha" color="grey-8" flat dense />
            <q-btn :disabled="!allLogin.every(i => i)" type="submit" color="pink-6" class="full-width" size="lg"
              label="Entrar" />
          </q-form>
        </q-card-section>
        <q-card-section>
          <p class="w-full border-t border-pink-600 h-8 relative flex justify-center">
            <span class="inline-block bg-white px-2 absolute -top-3 text-pink-6">ou</span>
          </p>
          <q-btn @click="google" outline size="lg" color="red-6" label="Entrar com Google" class="full-width" no-caps />
        </q-card-section>
        <q-card-section>
          <q-btn @click="getRegisterComponent" no-caps class="full-width mb-8" label="Clique aqui para se cadastrar"
            color="grey-8" flat dense />
        </q-card-section>
      </q-card>
    </transition>
    <transition enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
      <q-card v-if="show == 'register'" class="w-[98%] max-w-[700px] mx-auto">
        <q-card-section header class="w-full flex gap-2 items-center">
          <q-avatar size="sm">
            <q-img src="/imgs/logo-2.png" />
          </q-avatar>
          <h2 class="leading-3 uppercase text-pink-6 font-extrabold text-2xl">Sweet Control</h2>
        </q-card-section>
        <q-card-section>
          <q-form class="w-full flex flex-col gap-4 items-start" @submit.prevent="register">
            <p>Olá, vamos criar sua conta</p>
            <q-input class="w-full" v-model="email" outlined label-color="pink-6" color="pink-6" required type="email"
              label="Seu Email" />
            <q-input class="w-full" v-model="password" :rules="[
              val => !!val || 'A senha é obrigatória',
              val => val.length >= 6 || 'A senha deve ter pelo menos 6 caracteres',
              val => /[A-Za-z]/.test(val) || 'A senha deve conter letras',
              val => /[0-9]/.test(val) || 'A senha deve conter números'
            ]" outlined label-color="pink-6" color="pink-6" required :type="type" label="Sua Senha">
              <template #append>
                <q-btn round dense flat color="pink-6" :icon="type == 'password' ? 'visibility_off' : 'visibility'"
                  @click="type = type == 'password' ? 'text' : 'password'" />
              </template>
            </q-input>
            <q-input :rules="[
              val => val == password || 'As senhas não são iguais'
            ]" class="w-full" v-model="password_confirm" outlined label-color="pink-6" color="pink-6" required
              :type="type" label="Confirme Sua Senha">
              <template #append>
                <q-btn round dense flat color="pink-6" :icon="type == 'password' ? 'visibility_off' : 'visibility'"
                  @click="type = type == 'password' ? 'text' : 'password'" />
              </template>
            </q-input>
            <q-btn :disabled="!allRegister.every(i => i)" color="pink-6" class="full-width" size="lg" label="Cadastrar"
              type="submit" />
          </q-form>
        </q-card-section>
        <q-card-section>
          <p class="w-full border-t border-pink-600 h-8 relative flex justify-center">
            <span class="inline-block bg-white px-2 absolute -top-3 text-pink-6">ou</span>
          </p>
          <q-btn outline size="lg" color="red-6" label="Cadastrar com Google" class="full-width" no-caps />
        </q-card-section>
        <q-card-section>
          <q-btn @click="getRegisterComponent" no-caps class="full-width mb-8" label="Clique aqui para entrar"
            color="grey-8" flat dense />
        </q-card-section>
      </q-card>
    </transition>
    <transition enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown">
      <q-card v-if="show == 'recover'" class="w-[98%] max-w-[700px] mx-auto">
        <q-card-section header class="w-full flex gap-2 items-center">
          <q-avatar size="sm">
            <q-img src="/imgs/logo-2.png" />
          </q-avatar>
          <h2 class="leading-3 uppercase text-pink-6 font-extrabold text-2xl">Sweet Control</h2>
        </q-card-section>
        <q-card-section>
          <q-form class="w-full flex flex-col gap-4 items-start" @submit.prevent="recover">
            <p>Para recuperar a sua senha, vamos enviar um link para seu email</p>
            <q-input class="w-full" v-model="email" outlined label-color="pink-6" color="pink-6" required type="email"
              label="Seu Email" />
            <q-btn type="submit" :disabled="!allRecover.every(i => i)" color="pink-6" class="full-width" size="lg"
              label="Enviar" />
          </q-form>
        </q-card-section>
        <q-card-section>
          <q-btn @click="getRegisterComponent" no-caps class="full-width mb-8" label="Clique aqui para entrar"
            color="grey-8" flat dense />
        </q-card-section>
      </q-card>
    </transition>
  </q-page>
</template>

<script>
import { useQuasar } from 'quasar'

export default {
  // name: 'PageName',
  data() {
    return {
      type: 'password',
      email: null,
      password: null,
      $q: useQuasar(),
      password_confirm: null,
      show: 'login',
      allLogin: [false, false],
      allRegister: [false, false, false],
      allRecover: [false],
    }
  },
  mounted() {
    if(this.$route.query && this.$route.query.email){
      this.email = this.$route.query.email;
      this.password = null
    }
    setTimeout(() => {
      this.show = 'login'
    }, 500)
  },
  watch: {
    email(newValue) {
      if (newValue && newValue !== '') {
        this.allLogin[0] = true
        this.allRegister[0] = true
        this.allRecover[0] = true
      } else {
        this.allLogin[0] = false
        this.allRegister[0] = false
        this.allRecover[0] = false
      }
    },
    password(newValue) {
      if (newValue && newValue !== '') {
        this.allLogin[1] = true

        this.allRegister[1] = true
      } else {
        this.allLogin[1] = false
        this.allRegister[1] = false
      }
    },
    password_confirm(newValue) {
      if (newValue && newValue !== '') {
        this.allRegister[2] = true
      } else {
        this.allRegister[2] = false
      }
    },
  },
  methods: {
    async recover() {
      this.$q.loading.show()
      const res = await this.$db.resetPassword(this.email);
      console.log(res)
      if (!res.success) {
        this.$q.notify({
          message: "Houve um erro inesperado, já estamos trabalhando nisso",
          color: 'negative',
          position: 'center',
          timeout: 3500
        })
      } else {
        this.$q.notify({
          message: "Se o email digitado existe na nossa base de dados, enviamos um link para recuperar sua senha, confere lá!",
          color: 'positive',
          position: 'center',
          timeout: 5000
        })
        this.$router.push('/')
      }
      this.$q.loading.hide()
    },
    async google() {
      this.$q.loading.show()
      const res = await this.$db.google();
      console.log(res)
      if (!res.success) {
        this.$q.notify({
          message: "Houve um erro inesperado, já estamos trabalhando nisso",
          color: 'negative',
          position: 'center',
          timeout: 3500
        })
      } else {
        this.$router.push('/admin/expenses')
      }

      this.$q.loading.hide()
    },
    async login() {
      this.$q.loading.show()
      const res = await this.$db.login(this.email, this.password);
      console.log(res)
      if (!res.success) {
        this.$q.notify({
          message: "Dados incorretos, por favor verifique",
          color: 'negative',
          position: 'center',
          timeout: 3500
        })
      } else {
        this.$router.push('/admin/expenses')
      }

      this.$q.loading.hide()
    },
    async register() {
      this.$q.loading.show()
      const res = await this.$db.registerEmail(this.email, this.password);
      console.log(res)
      if (!res.success) {
        if (res.error && res.error.code == "auth/email-already-in-use") {
          this.$q.notify({
            message: "Email já cadastrado, faça login na sua conta",
            color: 'negative',
            position: 'center',
            timeout: 3500
          });
          this.show = null;
          setTimeout(() => this.show = 'login', 500)
        } else {
          this.$q.notify({
            message: "Dados incorretos, por favor verifique",
            color: 'negative',
            position: 'center',
            timeout: 3500
          })
        }
      } else {
        this.$router.push('/admin/expenses')
      }

      this.$q.loading.hide()
    },
    changeComponentToRecover() {
      this.show = null;
      setTimeout(() => this.show = 'recover', 500)
    },
    getRegisterComponent() {
      if (this.show == 'login') {
        this.show = null;
        setTimeout(() => this.show = 'register', 500)
      }
      if (this.show == 'register') {
        this.show = null;
        setTimeout(() => this.show = 'login', 500)
      }
      if (this.show == 'recover') {
        this.show = null;
        setTimeout(() => this.show = 'login', 500)
      }
    }
  }
}
</script>
