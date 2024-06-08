<template>
  <q-page padding class="w-[98%] rounded mx-auto h-full max-w-[900px]  " >
    <div>
      <div class="w-full h-[100px]">
        <div class="w-full h-[40px] flex justify-between items-center gap-2">
          <q-btn flat icon="arrow_left" color="pink-6" @click="prevMonth" />
          <q-btn flat icon="undo" color="pink-6" @click="recover" />

          <q-btn-dropdown flat :label="config.months.find(m => m.id == currentMonth).name" color="pink-6"
            class="flex-1">
            <q-list dense separator>
              <q-item class="uppercase text-pink-6"
                :class="[month.id == currentMonth ? 'bg-pink-200' : Number(moment().format('MM')) == month.id ? 'bg-pink-50' : 'bg-white']"
                v-close-popup clickable v-for="month in config.months" :key="month.id" @click="currentMonth = month.id">
                <q-item-section>
                  <q-item-label>{{ month.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
          <q-input v-model="config.currentYear" class="w-[100px]" input-class=" text-center text-pink-6 font-bold" dense
            borderless @keyup.enter="updateYear">
            <template v-slot:append>
              <q-btn flat icon="done" size="xs" color="pink-6" @click="updateYear" />
            </template>
          </q-input>
          <q-btn flat icon="arrow_right" color="pink-6" @click="nextMonth" />
        </div>
        <div class="w-full h-[60px] flex justify-between items-center gap-2">
          <div class="p-2">
            <p class="uppercase text-xs">Total Receita</p>
            <p class="font-extrabold text-blue">{{ totalIncoming.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL'
            }) }}</p>
          </div>
          <div class="p-2">
            <p class="uppercase text-xs">Total Despesas</p>
            <p class="font-extrabold text-pink-600">{{ totalExpenses.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL'
            }) }}</p>
          </div>
          <div class="p-2">
            <p class="uppercase text-xs">Saldo</p>
            <p class="font-extrabold" :class="saldo < 0 ? 'text-red' : 'text-green'">{{ saldo.toLocaleString('pt-br', {
              style: 'currency',
              currency: 'BRL'
            }) }}</p>
          </div>
        </div>
      </div>
      <q-scroll-area class="w-full" style="height:calc(100vh - 240px)">
        <q-list class="w-full">
          <q-slide-item :left-color="item.checked ? 'pink' : 'green'" right-color="blue"
            @left="props => onLeft(props, item)" @right="props => onRight(props, item)" v-for="(item, index) in incomes"
            :key="index" class="shadow-md my-2 rounded bg-gray-50">
            <template #left>
              <p><q-icon size="xs" :name="item.checked ? 'close' : 'done'" class="mr-2" />Marcar como {{ item.checked ?
                'não recebido' : 'recebido' }}</p>
            </template>
            <template #right>
              <p><q-icon size="xs" name="delete" class="mr-2" />Editar</p>
            </template>
            <q-item class="w-full h-full">
              <q-item-section side>
                <q-icon :name="getIcon(item)" size="sm" :color="getIconColor(item)" />
              </q-item-section>
              <q-item-section>
                <q-item-label class="uppercase font-medium">
                  {{ item.description }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-item-label class="font-extrabold text-pink-600">
                  R${{ item.ammount }}
                </q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn flat round color="red" icon="delete">
                  <q-menu>
                    <q-list separator class="bg-pink-100 text-pink-600 font-bold">
                      <q-item clickable v-close-popup @click="deleteincoming(item, 1)">
                        <q-item-section>{{ item.repeat == 1 ? 'Deletar Despesa' : 'Deletar Apenas Essa'
                          }}</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteincoming(item, 2)"
                        v-if="item.repeat == 2 || item.repeat == 3">
                        <q-item-section>Deletar Todas</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup @click="deleteincoming(item, 3)"
                        v-if="item.repeat == 2 || item.repeat == 3">
                        <q-item-section>
                          <q-item-section>Deletar Essa E As Próximas</q-item-section>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-slide-item>
        </q-list>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script>
import moment from 'moment';
import { useConfig } from 'src/stores/example-store';

export default {
  data() {
    return {
      config: useConfig(),
      moment
    }
  },
  async mounted() {
    await this.config.getData('expenses')
    await this.config.getData(this.$route.path.endsWith('incoming') ? 'incoming' : 'expense')
  },
  computed: {
    incomes: {
      get() {
        return this.config.incomes
      },
      set(val) {
        this.config.incomes = val
      }
    },
    currentMonth: {
      get() {
        return this.config.currentMonth
      },
      set(val) {
        this.config.currentMonth = val
      }
    },
    totalIncoming() {
      return this.config.incomes.reduce((a, b) => a + Number(b.ammount.replace(',', '.')), 0)

    },
    totalExpenses() {
      return this.config.expenses.reduce((a, b) => a + Number(b.ammount.replace(',', '.')), 0)
    },
    saldo() {
      return this.totalIncoming - this.totalExpenses;
    }
  },
  watch: {
    async currentMonth(val) {
      try {
        // Formatar a data atual em um formato ISO aceitável
        let curDate = moment(this.config.currentDate, 'YYYY-MM-DD').format('DD');

        // Atualizar a data atual com o novo mês e ano, mantendo o dia
        this.config.currentDate = moment(`${this.config.currentYear}-${this.config.currentMonth}-${curDate}`, 'YYYY-MM-DD').format('YYYY-MM-DD');

        // Chamar a função getData com a coleção apropriada
        await this.config.getData('expense')

        await this.config.getData('incoming')
      } catch (e) {
        console.error('Erro ao atualizar o mês atual:', e);
      }
    }
  },
  methods: {
    async deleteincoming(item, type) {
      const res = await this.$db.deleteData(item, type)
      if (res.success) {
        this.$q.notify({
          message: `Despesa deletada com sucesso!`,
          color: 'green',
          icon: 'check_circle'
        })
      } else {
        this.$q.notify({
          message: `Erro ao deletar despesa!`,
          color: 'red',
          icon: 'error'
        })
      }
    },
    async onLeft({ reset }, item) {
      const res = await this.$db.updateItem('expenses', item.id, { checked: !item.checked });
      if (res.success) this.config.getData('incoming');
      reset()
    },
    onRight({ reset }, item) {
      this.config.expenseEdit = true;
      this.config.expense = {
        description: item.description,
        ammount: item.ammount,
        duedate: item.duedate,
        installments: item.installments,
        repeat: item.repeat,
        parent: item.parent,
        installment: item.installment,
        checked: item.checked,
      }
      this.config.expense['id'] = item.id;
      this.config.show = 'incoming';
      console.log(this.config.show)
      reset()
    },
    getIcon(item) {
      if (item.checked) return 'done';
      const numCurDate = parseInt(this.config.currentDate.replace(/-/g, ''), 10)
      if (item.repeat == 3) return 'schedule'
      if (item.date < numCurDate) return 'error'
      if (item.date == numCurDate) return 'schedule'
      if (item.date > numCurDate) return 'info';
    },
    getIconColor(item) {
      if (item.checked) return 'green';
      const numCurDate = parseInt(this.config.currentDate.replace(/-/g, ''), 10)
      if (item.repeat == 3) return 'blue'
      if (item.date < numCurDate) return 'red'
      if (item.date == numCurDate) return 'pink'
      if (item.date > numCurDate) return 'blue';
    },
    async nextMonth() {
      this.config.currentDate = moment(this.config.currentDate).add(1, 'month').format('YYYY-MM-DD');
      this.config.currentMonth = Number(moment(this.config.currentDate).format('MM'));
      this.config.currentYear = Number(moment(this.config.currentDate).format('YYYY'));
      this.config.getData('incoming');
      await this.config.getData('expense')
    },
    async prevMonth() {
      this.config.currentDate = moment(this.config.currentDate).subtract(1, 'month').format('YYYY-MM-DD');
      this.config.currentMonth = Number(moment(this.config.currentDate).format('MM'));
      this.config.currentYear = Number(moment(this.config.currentDate).format('YYYY'));
      this.config.getData('incoming');
      await this.config.getData('expense')
    },
    async recover() {
      this.config.currentDate = moment().format('YYYY-MM-DD');
      this.config.currentMonth = Number(moment(this.config.currentDate).format('MM'));
      this.config.currentYear = Number(moment(this.config.currentDate).format('YYYY'));
      this.config.getData('incoming');
      await this.config.getData('expense')
    },
    async updateYear() {
      const curDate = moment(this.config.currentDate).format('DD');
      const curMonth = moment(this.config.currentDate).format('MM');
      const newDate = `${this.config.currentYear}-${curMonth}-${curDate}`;

      // Verifique se o newDate está em um formato válido
      if (moment(newDate, 'YYYY-MM-DD', true).isValid()) {
        this.config.currentDate = moment(newDate).format('YYYY-MM-DD');
        await this.config.getData('incoming');
        await this.config.getData('expense');
      } else {
        console.error('Data inválida:', newDate);
      }
    }

  }
}
</script>
