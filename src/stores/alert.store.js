import { defineStore } from 'pinia';

export const useAlertStore = defineStore('alert', {
    state: () => ({
        //상태변수
        alert: null
    }),

    actions: {
        success(message) {
            this.alert = { message, type: 'alert-success' };
        },
        error(message) {
            this.alert = { message, type: 'alert-danger' };
        },
        clear() {
            this.alert = null;
        }
    }
});