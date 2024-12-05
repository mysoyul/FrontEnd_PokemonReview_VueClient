import { defineStore } from 'pinia';
import { fetchWrapper } from '@/helpers';

const baseUrl = `${import.meta.env.VITE_API_URL}`;

export const useUsersStore = defineStore('users', {
    state: () => ({
        user: {},
        pageInfo: {},
        users: {},
    }),
    actions: {
        async register(user) {
            await fetchWrapper.post(`${baseUrl}/auth/register`, user);
        },
        async getAll(params) {
            this.users = { loading: true };
            try {
                const queryString = new URLSearchParams(params).toString();
                const { content, pageSize, totalElements, totalPages } =
                    await fetchWrapper.get(`${baseUrl}/admin/users?${queryString}`);
                this.users = content;
                this.pageInfo = { pageSize, totalElements, totalPages }
            } catch (error) {
                this.users = { error };
            }
        },
    }
});