import { defineStore } from 'pinia';

type stateShape = {
    user: {
        id?: string;
        name?: string;
        family?: string;
        profile?: string;
        gender?: string;
        phone?: string;
        email?: string;
        wallet: number;
        role_id?: string;
        role?: { persian_name: string; id: number };
        last_seen?: string;
        created_at?: string;
        show_wallet?: boolean;

        province?: {
            id: number;
            name: string;
        };
        city?: {
            id: number;
            name: string;
        };
        lawyer?: {
            satisfied?: string;
        };
        call_fee?: { price: number | string };
    };

    wallet?: number;

    lawyer: {
        id?: string;
        call_fee?: { price: number | string };
        vacation?: boolean;
        name?: string;
        family?: string;
        profile?: string;
        gender?: string;
        phone?: string;
        email?: string;
        wallet: number;
        role_id?: string;
        role?: { persian_name: string; id: number };
        last_seen?: string;
        created_at?: string;
        province?: {
            id: number;
            name: string;
        };
        city?: {
            id: number;
            name: string;
        };
    };

    panel: {
        id: number;
        name: string;
        icon: string;
        title_fa: string;
        route: string;
        guard_name: string;
        created_at: string;
        updated_at: string;
        role_id: string;
    }[];
};

export const useAuthStore = defineStore('auth', {
    state: (): stateShape => ({
        user: {
            wallet: 0,
        },
        lawyer: {
            wallet: 0,
        },
        panel: [],
    }),

    getters: {
        // loggedIn: (state) => (state.user.id ? true : false),
        loggedIn: (state) => {
            const token = useCookie('token');
            return token.value ? true : false;
        },
    },

    actions: {
        async logout() {
            const token = useCookie('token');

            if (token.value) {
                const { data, error, pending }: any = await useMyFetch('/auth/logout');

                if (data.value) {
                    this.clearToken();
                    this.clearUser();
                    this.clearPanel();
                    navigateTo('/login');
                }
                if (error.value) {
                    this.clearToken();
                    this.clearUser();
                    this.clearPanel();
                    navigateTo('/login');
                }
            } else {
                this.clearToken();
                this.clearUser();
                this.clearPanel();

                navigateTo('/login');
            }
        },
        async getUserInfo(token?: string) {
            const $config = useRuntimeConfig();
            const tokenValue = useCookie('token');
            try {
                const data: any = await $fetch($config.public.baseURL + '/auth/user', {
                    headers: { Authorization: `Bearer ${token || tokenValue.value}` },
                });

                this.addUser(data.data);

                return data;
            } catch (err: any) {
                return false;
            }
        },

        async getPanelInfo() {
            const $config = useRuntimeConfig();
            const token = useCookie('token');

            const panel: any = await $fetch($config.public.baseURL + '/access-panel', {
                headers: { Authorization: `Bearer ${token.value}` },
            });
            this.addPanel(panel);
        },

        async getLawyerInfo() {
            const $config = useRuntimeConfig();
            const token = useCookie('token');

            const lawyer: any = await $fetch($config.public.baseURL + '/panel/lawyer/info', {
                headers: { Authorization: `Bearer ${token.value}` },
            });
            this.addLawyer(lawyer);
        },

        addPanel(panel: any) {
            this.panel = panel;
        },

        addUser(user: any) {
            this.user = user;
        },
        addLawyer(lawyer: any) {
            this.lawyer = lawyer;
        },

        setLogoutTimer(duration: number) {
            setTimeout(() => {
                this.logout();
            }, duration);
        },
        clearToken() {
            const token = useCookie('token');
            token.value = null;
        },
        clearUser() {
            this.user = {
                wallet: 0,
            };
            this.panel = [];
            const token = useCookie('token');
            token.value = null;
        },
        clearPanel() {
            this.panel = [];
        },
    },

    // persist: true,
});
