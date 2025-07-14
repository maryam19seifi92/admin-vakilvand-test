<template>
    <div>
        <div class="mb-4 flex items-center gap-4">
            <h2 class="text-xl">پرونده ها</h2>

            <button type="button" class="btn btn-primary mr-auto flex items-center gap-x-1" @click="addNewModal = true">
                <span> افزودن پرونده </span>
                <IconPlus class="ltr:mr-2 rtl:ml-2" />
            </button>
        </div>

        <div class="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div class="dropdown">
                <client-only>
                    <Popper placement="bottom-end" offsetDistance="0" class="align-middle">
                        <button
                            type="button"
                            class="flex items-center rounded-md border border-[#e0e6ed] px-4 py-2 text-sm font-semibold dark:border-[#253b5c] dark:bg-[#1b2e4b] dark:text-white-dark"
                        >
                            <span>فیلتر</span>

                            <icon-caret-down class="h-5 w-5" />
                        </button>
                        <template #content>
                            <div class="grid w-80 gap-3 bg-white p-3">
                                <BaseMultiSelect :options="lawyers" label="وکیل مسئول" placeholder="انتخاب مسئول رسیدگی" v-model="filter" />
                                <BaseMultiSelect :options="categories" label="موضوع پرونده" placeholder="انتخاب موضوع پرونده" v-model="filter" />
                                <BaseMultiSelect :options="stages" label="مرحله رسیدگی" placeholder="انتخاب مرحله رسیدگی" v-model="filter" />
                                <BaseMultiSelect :options="[]" label="وضعیت مالی" placeholder="انتخاب وضعیت مالی" v-model="filter" />
                                <div class="flex items-center justify-end gap-x-2">
                                    <button type="button" class="btn btn-primary" @click="getData()">اعمال فیلتر</button>
                                    <button type="button" class="btn btn-outline-primary" @click="clearFilter">حذف فیلتر</button>
                                </div>
                            </div>
                        </template>
                    </Popper>
                </client-only>
            </div>

            <div class="dropdown">
                <client-only>
                    <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-end' : 'bottom-start'" offsetDistance="0" class="align-middle">
                        <button
                            type="button"
                            class="flex items-center rounded-md border border-[#e0e6ed] px-4 py-2 text-sm font-semibold dark:border-[#253b5c] dark:bg-[#1b2e4b] dark:text-white-dark"
                        >
                            <span class="ltr:mr-1 rtl:ml-1">ستون ها</span>
                            <icon-caret-down class="h-5 w-5" />
                        </button>
                        <template #content>
                            <ul class="whitespace-nowrap">
                                <template v-for="(col, i) in cols" :key="i">
                                    <li>
                                        <div class="flex items-center px-4 py-1">
                                            <label class="mb-0 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    class="form-checkbox"
                                                    :id="`chk-${i}`"
                                                    :value="col.field"
                                                    @change="col.hide = !$event.target.checked"
                                                    :checked="!col.hide"
                                                />
                                                <span :for="`chk-${i}`" class="ltr:ml-2 rtl:mr-2">{{ col.title }}</span>
                                            </label>
                                        </div>
                                    </li>
                                </template>
                            </ul>
                        </template>
                    </Popper>
                </client-only>
            </div>

            <div class="relative">
                <input
                    type="text"
                    placeholder="جستجو بر اساس موکل"
                    class="peer form-input py-2 ltr:pr-11 rtl:pl-11"
                    v-model="search"
                    @input="inputChange"
                    @keyup.enter.exact="searchData"
                />
                <div class="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                    <icon-search class="mx-auto" />
                </div>
            </div>

            <div class="mr-auto flex items-center gap-x-2 rounded border border-info p-1">
                <button
                    type="button"
                    class="btn btn-sm flex items-center gap-x-1 !border-none"
                    :class="tab === item.id ? 'btn-info' : 'btn-outline-info'"
                    @click="tab = item.id"
                    v-for="item in tabs"
                    :key="item.id"
                >
                    <span>
                        {{ item.title }}
                    </span>
                </button>
            </div>
        </div>
        <div class="panel mt-6 pb-0">
            <div class="datatable">
                <vue3-datatable
                    paginationInfo="نمایش {0} تا {1} از کل {2} "
                    :hasCheckbox="true"
                    :rows="rows"
                    :columns="cols"
                    :totalRows="total"
                    noDataContent=" "
                    :sortable="true"
                    skin="whitespace-nowrap bh-table-hover"
                    firstArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M13 19L7 12L13 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    lastArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M11 19L17 12L11 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> <path opacity="0.5" d="M6.99976 19L12.9998 12L6.99976 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg> '
                    previousArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M15 5L9 12L15 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                    nextArrow='<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-4.5 h-4.5 rtl:rotate-180"> <path d="M9 5L15 12L9 19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/> </svg>'
                >
                    <template #participants="data">
                        <span v-for="item in data.value.participants">
                            {{ item.name }}
                        </span>
                    </template>
                    <template #category="data">
                        {{ data.value.category?.name }}
                    </template>
                    <template #stage="data">
                        {{ data.value.stage?.name }}
                    </template>
                    <template #clients="data">
                        <span v-for="item in data.value.clients">
                            {{ item.reagent }}
                        </span>
                    </template>
                </vue3-datatable>

                <div v-if="!rows.length" class="pb-4 text-center">
                    <img src="/empty/matter.svg" alt="" class="mx-auto" />

                    <p class="mb-2 font-bold">هنوز هیچ پرونده‌ای ثبت نکرده‌اید.</p>
                    <p class="mb-4 text-gray-600">
                        با ثبت پرونده‌ها، دفتر حقوقی خود را هوشمند کنید — در هر لحظه و مکان به بایگانی پرونده‌های خود دسترسی داشته باشید و کارهای حقوقی‌تان را
                        سریع‌تر و منظم‌تر مدیریت کنید.
                    </p>

                    <button type="button" class="btn btn-primary mx-auto flex items-center gap-x-1" @click="addNewModal = true">
                        افزودن پرونده
                        <IconPlus class="ltr:mr-2 rtl:ml-2" />
                    </button>
                </div>
            </div>
        </div>

        <LazyMatterAdd
            :open="addNewModal"
            @close="addNewModal = false"
            @get-data="getData"
            :countries="countries"
            :stages="stages"
            :clients="clients"
            :lawyers="lawyers"
            :categories="categories"
        />
    </div>
</template>
<script lang="ts" setup>
    import { ref, onMounted, watch } from 'vue';
    import Swal from 'sweetalert2';
    useHead({ title: 'پرونده ها' });
    import Vue3Datatable from '@bhplugin/vue3-datatable';

    import { useAppStore } from '@/stores/index';
    const store = useAppStore();

    const search = ref('');

    const { data: lawyers } = await useMyFetch('/matter-case/lawyers', {
        transform: (result) => {
            return result.map((p) => ({ id: p.id, label: p.user?.name || '', ...p }));
        },
    });

    const { data: categories } = await useMyFetch('/matter-case/categories', {
        transform: (result) => {
            return result.map((p) => ({ id: p.id, label: p.name, ...p }));
        },
    });

    const { data: stages } = await useMyFetch('/matter-case/stages', {
        transform: (result) => {
            return result.map((p) => ({ id: p.id, label: p.name, ...p }));
        },
    });
    const { data: clients } = await useMyFetch('/contact', {
        transform: (result) => {
            return result.data.map((p) => ({ id: p.id, label: p.firm_specific_display_name, ...p }));
        },
    });
    const { data: countries } = await useMyFetch('/countries');

    const total = ref(1);
    const currentPage = ref(1);
    const lastPage = ref(1);

    const filter = ref({
        lawyer: '',
        category: '',
        stage: '',
        status: '',
    });

    const getData = async (page?: boolean) => {
        try {
            store.toggleLoader(true);
            const { data } = await useMyFetch(
                `/matter?type=&lawyer=${filter.value.lawyer}&client=${search.value}&category=${filter.value.category}&stage=${filter.value.stage}&status=${filter.value.status}`
            );

            store.toggleLoader(false);

            currentPage.value = data.value.current_page;
            lastPage.value = data.value.last_page;
            total.value = data.value.total;

            rows.value = data.value.data;
        } catch (err: any) {
            store.toggleLoader(false);
        }
    };

    getData();

    const tab = ref('all');
    const tabs = ref([
        { id: 'all', title: 'همه' },
        { id: 'closed', title: 'مختومه شده' },
        { id: 'ongoing', title: 'جاری' },
    ]);

    watch(tab, (newVal, oldVal) => {
        getData();
    });
    const cols = ref([]);

    const colsList = ref([
        { field: 'action', title: 'اقدام بعدی', isUnique: true, hide: false },
        { field: 'id', title: 'شناسه', hide: false },
        { field: 'participants', title: 'موکل / موکلین', hide: false },
        { field: 'category', title: 'موضوع پرونده', hide: false },
        { field: 'case_name', title: 'عنوان پرونده', hide: false },
        { field: 'notif', title: 'اعلان ها پرونده', hide: true },
        { field: 'stage', title: 'مرحله رسیدگی', hide: true },
        { field: 'clients', title: 'طرف/طرفین', hide: true },
        { field: 'status', title: 'وضعیت مالی', hide: false },
    ]);

    const rows = ref([]);

    const addNewModal = ref(false);

    onMounted(() => {
        const saved = localStorage.getItem('matterKey');

        cols.value = saved ? JSON.parse(saved) : colsList.value;
    });

    watch(
        () => cols.value,
        (newValue, oldValue) => {
            localStorage.setItem('matterKey', JSON.stringify(newValue));
        },
        { deep: true }
    );

    const clearFilter = () => {
        filter.value.lawyer = '';
        filter.value.stage = '';
        filter.value.status = '';
        filter.value.category = '';
        getData();
    };

    const searchData = async () => {
        currentPage.value = 1;
        getData();
    };

    const inputChange = useDebounceFn(searchData, 2000);
</script>

<style scoped>
    .brown {
        border-color: #964b00;
        color: #964b00;
    }
    .pink {
        border-color: #ff8da1;
        color: #ff8da1;
    }
    .blue {
        border-color: #0000cd;
        color: #0000cd;
    }
    .light_blue {
        border-color: #90d5ff;
    }
    .red {
        border-color: #fa5053;
        color: #fa5053;
    }
    .green {
        border-color: #008000;
        color: #008000;
    }
    .light_green {
        border-color: #89f336;
        color: #89f336;
    }
    .orange {
        border-color: #ff7518;
        color: #ff7518;
    }
    .dark_blue {
        border-color: #272757;
        color: #272757;
    }
    .gray {
        border-color: #6d8196;
    }
    .purple {
        border-color: #873260;
        color: #873260;
    }
    .light_purple {
        border-color: #9d00ff;
        color: #9d00ff;
    }
</style>
