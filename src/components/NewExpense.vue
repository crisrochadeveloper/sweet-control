<template>
  <div class="fixed  let-0 w-full z-40" :class="[$q.screen.xs || $q.screen.sm ? 'bottom-20' : 'bottom-0']">
    <transition enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown"
      class="w-[98%] max-w-[700px] mx-auto">
      <q-card v-if="show == 'expense'" class="w-[98%] max-w-[700px] mx-auto">
        <q-card-section header class="flex justify-between items-center">
          <h2 class="uppercase font-bold text-pink-6 text-xl leading 3">Nova Despesa</h2>
          <q-btn round flat icon="close" color="pink-6" @click="show = false" />
        </q-card-section>
        <q-card-section>
          <q-form class="w-full flex flex-col gap-4 items-start" @submit.prevent="addData">
            <q-input class="w-full" v-model="expense.description" outlined label-color="pink-6" color="pink-6" required
              type="text" label="Descrição" />
            <q-input class="w-full" v-model="expense.ammount" inputmode="numeric" outlined label-color="pink-6"
              color="pink-6" required type="text" label="Valor" mask="##,##" reverse-fill-mask prefix="R$" />
            <q-input class="w-full" v-model="expense.duedate" outlined label-color="pink-6" color="pink-6" required
              type="date" label="Data de Vencimento" />
            <div class="w-full flex gap-2 items-center">
              <q-toggle label="Repetir" v-model="isInstallments" color="pink-6" class="text-pink-6" />
              <q-option-group v-if="isInstallments" inline
                :options="[{ value: 2, label: 'Em Parcelas' }, { value: 3, label: 'Fixo' }]" v-model="expense.repeat"
                color="pink-6" class="text-pink-6" />
            </div>
            <q-input v-if="isInstallments && expense.repeat == 2" class="w-full" v-model="expense.installments" outlined
              label-color="pink-6" color="pink-6" required type="number" label="Quantidade de Parcelas" />
            <q-btn label="Salvar" type="submit" color="pink-6" size="lg" class="full-width my-8" />
          </q-form>
        </q-card-section>
      </q-card>
    </transition>
    <transition enter-active-class="animated slideInUp" leave-active-class="animated slideOutDown"
      class="w-[98%] max-w-[700px] mx-auto">
      <q-card v-if="show == 'incoming'" class="w-[98%] max-w-[700px] mx-auto">
        <q-card-section header class="flex justify-between items-center">
          <h2 class="uppercase font-bold text-teal-6 text-xl leading 3">Nova Receita</h2>
          <q-btn round flat icon="close" color="teal-6" @click="show = false" />
        </q-card-section>
        <q-card-section>
          <q-form class="w-full flex flex-col gap-4 items-start" @submit.prevent="addData">
            <q-input class="w-full" v-model="expense.description" outlined label-color="teal-6" color="teal-6" required
              type="text" label="Descrição" />
            <q-input class="w-full" v-model="expense.ammount" inputmode="numeric" outlined label-color="teal-6"
              color="teal-6" required type="text" label="Valor" mask="##,##" reverse-fill-mask prefix="R$" />
            <q-input class="w-full" v-model="expense.duedate" outlined label-color="teal-6" color="teal-6" required
              type="date" label="Data de Vencimento" />
            <div class="w-full flex gap-2 items-center">
              <q-toggle label="Repetir" v-model="isInstallments" color="teal-6" class="text-teal-6" />
              <q-option-group v-if="isInstallments" inline
                :options="[{ value: 2, label: 'Em Parcelas' }, { value: 3, label: 'Fixo' }]" v-model="expense.repeat"
                color="teal-6" class="text-teal-6" />
            </div>
            <q-input v-if="isInstallments && expense.repeat == 2" class="w-full" v-model="expense.installments" outlined
              label-color="teal-6" color="teal-6" required type="number" label="Quantidade de Parcelas" />
            <q-btn label="Salvar" type="submit" color="teal-6" size="lg" class="full-width my-8" />
          </q-form>
        </q-card-section>
      </q-card>
    </transition>
  </div>
</template>

<script>
import moment from 'moment';
import { useQuasar } from 'quasar';
import { useConfig } from 'src/stores/example-store';

export default {
  computed: {
    show: {
      get() {
        return this.config.show
      },
      set(value) {
        this.config.show = value
      }
    },
    path() {
      return this.$route.path
    },
    expense: {
      get() { return this.config.expense },
      set(val) { this.config.expense = val }
    }
  },

  data() {
    return {
      $q: useQuasar(),
      isInstallments: false,
      config: useConfig(),
      isEdit: false
    }
  },
  watch: {
    isInstallments(val) {
      if (!this.config.expenseEdit) {
        if (!val) {
          this.expense.repeat = 1
        } else {
          this.expense.repeat = 2
        }
      } else {
        this.config.expenseEdit = false;
        this.isEdit = true;
      }
    },
    path(val) {
      this.show = null;
    },
    show(val) {
      console.log(this.config.expense)
      if (val) {
        if (this.config.expense.repeat == 1) {
          this.isInstallments = false;
        } else {
          this.isInstallments = true;
        }
      } else {
        this.isInstallments = false;
        this.resetExpense()
      }
    }
  },
  methods: {
    resetExpense() {
      this.isInstallments = false;
      this.expense = {
        description: null,
        ammount: null,
        duedate: null,
        installments: null,
        repeat: 1,
        parent: null,
        installment: 1,
        checked: true,
      }
      this.show = false;
      this.config.expenseEdit = false;
      this.isEdit = false;
    },
    async insertData(expense) {
      let newexpense = JSON.parse(JSON.stringify(expense))
      const dateFormat = moment(newexpense.duedate).format('YYYYMMDD')
      newexpense.date = parseInt(dateFormat, 10)
      expense.type = this.path.endsWith('expenses') ? 'expense' : 'incoming'
      let res;
      if (this.isEdit) {
        res = await this.$db.updateItem('expenses', expense.id, expense)
      }
      else {
        res = await this.$db.addData('expenses', { user_uid: this.config.userId, ...newexpense, type: this.$route.path.endsWith('expenses') ? 'expense' : 'incoming' });
      }
      return res;

    },
    async addData() {
      if (this.expense.repeat == 1 || this.expense.repeat == 3) {
        const res = await this.insertData(this.expense)
        if (res.success) {
          this.$q.notify({
            color: 'positive',
            message: this.show == 'expense' ? 'Despesa adicionada com sucesso!' : 'Receita adicionada com sucesso!',
            icon: 'check'
          })
        } else {
          this.$q.notify({
            color: 'negative',
            message: 'Erro ao adicionar despesa/receita, já estamos trabalhando nisso',
            icon: 'report_problem'
          })
          this.resetExpense()
        }
        this.resetExpense()
      }
      if (this.expense.repeat == 2) {
        const res = await this.insertData(this.expense);
        console.log(res)
        if (res.success) {
          for (let i = 1; i < this.expense.installments; i++) {
            let newexpense = { ...this.expense };
            newexpense.duedate = moment(this.expense.duedate).add(i, 'M').format('YYYY-MM-DD');
            if (newexpense.id) delete newexpense.id;
            newexpense.parent = res.id;
            newexpense.installment = i;
            const resdata = await this.insertData(newexpense);
          }
          this.$q.notify({
            color: 'positive',
            message: this.show == 'expense' ? 'Despesa adicionada com sucesso!' : 'Receita adicionada com sucesso!',
            icon: 'check'
          })
        } else {
          this.$q.notify({
            color: 'negative',
            message: 'Erro ao adicionar despesa/receita, já estamos trabalhando nisso',
            icon: 'report_problem'
          })
          this.resetExpense()
        }
        this.resetExpense()
      }

      await this.config.getData(this.$route.path.endsWith('expenses') ? 'expense' : 'incoming')
    }
  }
}
</script>

<style lang="scss" scoped></style>