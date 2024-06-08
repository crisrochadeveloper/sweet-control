<template>
  <q-layout view="hHh Lpr fFf" class="background-with-overlay"
    >
    <!-- Be sure to play with the Layout demo on docs -->

    <!-- (Optional) The Header -->
    <q-header class="bg-transparent text-pink-6">
      <q-toolbar>
        <q-toolbar-title class="flex items-center gap-2">
          <q-avatar square size="xs">
            <q-img src="/imgs/logo-2.png" />
          </q-avatar>
          <router-link to='/admin/expenses'>
            <h1 class="leading-3 uppercase font-extrabold text-sm">Sweet Control</h1>
          </router-link>

        </q-toolbar-title>

        <div class="flex items-center gap-2">

          <q-btn round flat dense color="pink-6">
            <q-avatar size="sm">
              <q-icon :name="getIcon()" />

            </q-avatar>
            <q-menu>
              <q-card>
                <q-list dense separator>
                  <q-item clickable @click="$db.logout">
                    <q-item-section side>
                      <q-icon name="logout" color="pink-6" />
                    </q-item-section>
                    <q-item-section>
                      Sair
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </q-menu>
          </q-btn>
          <q-tabs :inline-label="true" active-color="pink-8" v-if="!$q.screen.xs && !$q.screen.sm">
            <q-route-tab class="text-pink-6" icon="map" to="/admin/expenses" replace label="Despesas" />
            <q-route-tab class="text-teal-6" icon="assignment" to="/admin/incoming" replace label="Receita" />
            <q-btn round size="sm" push color="purple-6" :icon="config.show ? 'close' : 'add'" @click="openNew" />
          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>
    <NewExpense />
    <q-footer class="bg-white" v-if="$q.screen.xs || $q.screen.sm">

      <q-tabs switch-indicator active-color="pink-8">
        <q-route-tab class="text-pink-6" icon="map" to="/admin/expenses" replace label="Despesas" />
        <q-btn round size="lg" push color="purple-6" icon="add" @click="openNew" />
        <q-route-tab class="text-teal-6" icon="assignment" to="/admin/incoming" replace label="Receita" />
      </q-tabs>
    </q-footer>

    <q-page-container class="w-full h-full relative">
      <!-- This is where pages get injected -->
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
import { useQuasar } from 'quasar';
import NewExpense from 'src/components/NewExpense.vue'
import { useConfig } from 'src/stores/example-store';
import { ref } from 'vue'

export default {
  // name: 'LayoutName',
  components: { NewExpense },
  data() {
    return {
      leftDrawerOpen: false,
      user: null,
      $q: useQuasar(),
      show: null,
      config: useConfig(),

    }
  },
  computed: {
    currentRoutePath(val) {
      return this.$route.path;
    }
  },
  watch: {
    async currentRoutePath(val) {
      await this.config.getData(val.endsWith('expenses') ? 'expense' : 'incoming');
    }
  },
  async mounted() {
    const res = await this.$db.authUser();
    if (res.user) {
      this.user = res.user;
      this.config.userId = res.user.uid
    }

  },
  methods: {
    toggleLeftDrawer() {
      leftDrawerOpen.value = !leftDrawerOpen.value
    },
    getIcon() {

      if (this.user && this.user.photoURL) return 'img:' + this.user.photoURL
      return 'person'
    },
    openNew() {
      if (!this.config.show) {
        this.config.show = null;

        setTimeout(() => this.config.show = this.$route.name, 500)
      } else {
        this.config.show = null;
      }
      this.config.expenseEdit = false;
    }
  }
}
</script>
<style>
.background-with-overlay {
  background-image: url('/imgs/bg.png');
  background-position: center center;
  background-size: cover;
  position: relative; /* Necessário para posicionamento do :before */
}

.background-with-overlay::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.95); /* Cor branca com 50% de transparência */
  pointer-events: none; /* Permite clicar nos elementos por trás do :before */
}
</style>