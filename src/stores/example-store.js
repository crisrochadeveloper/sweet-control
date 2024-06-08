import { useStorage } from '@vueuse/core';
import moment from 'moment';
import { defineStore } from 'pinia';
import { firebase } from 'src/boot/firebase';
import { useRoute } from 'vue-router';

export const useConfig = defineStore('config', {
  state() {
    return {
      userId: useStorage('user-id', null),
      currentDate: moment().format('YYYY-MM-DD'),
      table: 'expenses',
      expenses: [],
      incomes: [],
      expense: {
        description: null,
        ammount: null,
        duedate: null,
        installments: null,
        repeat: 1,
        parent: null,
        installment: 1,
        checked: false,
      },
      show: null,
      expenseEdit: false,
      months: [
        { id: 1, name: 'Janeiro' },
        { id: 2, name: 'Fevereiro' },
        { id: 3, name: 'Março' },
        { id: 4, name: 'Abril' },
        { id: 5, name: 'Maio' },
        { id: 6, name: 'Junho' },
        { id: 7, name: 'Julho' },
        { id: 8, name: 'Agosto' },
        { id: 9, name: 'Setembro' },
        { id: 10, name: 'Outubro' },
        { id: 11, name: 'Novembro' },
        { id: 12, name: 'Dezembro' }
      ],
      currentMonth:Number(moment().format('MM')),
      currentYear:Number(moment().format('YYYY')),
    }
  },
  actions: {
    async getData(type) {
      const res = await firebase.getData(this.table, this.currentDate, type);
      if (res.success) {
        if (type == 'expense') {
          this.expenses = res.data;
        } else {
          this.incomes = res.data;
        }
      }
    }
  }
});
