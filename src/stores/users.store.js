import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useUsersStore = defineStore('users', {
    state: () => ({
        user: {}
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/auth/register`, user);
        },

    }
});