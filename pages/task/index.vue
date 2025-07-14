<script lang="ts" setup>
    import { ref, onMounted } from 'vue';
    useHead({ title: 'وظایف' });
    import Vue3Datatable from '@bhplugin/vue3-datatable';

    import { useAppStore } from '@/stores/index';
    const store = useAppStore();

    const { data: enums } = await useMyFetch('/task-enums');
    const { data: taskUser } = await useMyFetch('/task-users');

    const search = ref('');

    const dutyUser = ref('');
    const type = ref('');
    const priority = ref('');

    const tab = ref('all');

    const total = ref(1);
    const currentPage = ref(1);
    const lastPage = ref(1);

    const getData = async (page?: boolean) => {
        try {
            store.toggleLoader(true);
            const { data } = await useMyFetch(
                `/task?status=${tab.value}&priority=${priority.value}&type=${type.value}&taskUser=${dutyUser.value}&client=${search.value}`
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

    watch(tab, (newVal, oldVal) => {
        getData();
    });

    const clearFilter = () => {
        dutyUser.value = '';
        priority.value = '';
        type.value = '';

        getData();
    };

    const searchData = async () => {
        currentPage.value = 1;
        getData();
    };

    const inputChange = useDebounceFn(searchData, 2000);

    const cols = ref([]);

    const colsList =
        ref([
            { field: 'action', title: 'مدیریت', isUnique: true, hide: false },
            { field: 'date', title: 'تاریخ وظیفه', hide: false },
            { field: 'time', title: 'ساعت', hide: false },
            { field: 'title', title: 'عنوان', hide: false },
            { field: 'description', title: 'توضیحات', hide: false },
            { field: 'firm', title: 'پرونده', hide: true },
            { field: 'created_by', title: 'درج شده توسط', hide: true },
            { field: 'assignable', title: 'مسئول وظیفه', hide: true },
            { field: 'type', title: 'نوع وظیفه', hide: true },
            { field: 'status', title: 'وضعیت', hide: false },
            { field: 'priority', title: 'الویت وظیفه', hide: false },
        ]) || [];

    const rows = ref([]);

    const addNewModal = ref(false);

    onMounted(() => {
        const saved = localStorage.getItem('taskKey');

        cols.value = saved ? JSON.parse(saved) : colsList.value;
    });

    watch(
        () => cols.value,
        (newValue, oldValue) => {
            localStorage.setItem('taskKey', JSON.stringify(newValue));
        },
        { deep: true }
    );
</script>

<template>
    <div>
        <div class="mb-4 flex items-center gap-4">
            <h2 class="text-xl">وظایف</h2>

            <button type="button" class="btn btn-primary mr-auto flex items-center gap-x-1" @click="addNewModal = true">
                <span> افزودن وظیفه </span>
                <IconPlus class="ltr:mr-2 rtl:ml-2" />
            </button>
        </div>

        <div class="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3">
            <div class="dropdown">
                <client-only>
                    <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="0" class="align-middle">
                        <button
                            type="button"
                            class="flex items-center rounded-md border border-[#e0e6ed] px-4 py-2 text-sm font-semibold dark:border-[#253b5c] dark:bg-[#1b2e4b] dark:text-white-dark"
                        >
                            <span>فیلتر</span>

                            <icon-caret-down class="h-5 w-5" />
                        </button>
                        <template #content="{ close }">
                            <div class="whitespace-nowrap rounded border bg-white p-4">
                                <BaseMultiSelect label="دستیار" placeholder="انتخاب دستیار" :options="[]" class="mb-4" v-model="type" />
                                <BaseMultiSelect
                                    label="مسئول وظیفه"
                                    placeholder="انتخاب مسئول رسیدگی"
                                    :options="taskUser.map((el) => ({ label: el.user?.name, id: el.id }))"
                                    class="mb-4"
                                    v-model="dutyUser"
                                />

                                <BaseMultiSelect
                                    label="اولویت "
                                    placeholder="انتخاب اولویت وظیفه"
                                    :options="enums.priority.map((el) => ({ id: el.key, label: el.label }))"
                                    class="mb-4"
                                    v-model="priority"
                                />
                                <BaseMultiSelect
                                    label="نوع وظیفه"
                                    placeholder="انتخاب نوع وظیفه"
                                    :options="[
                                        { label: 'تنظیم اوراق', id: '0' },
                                        { label: 'جلسه رسیدگی', id: '1' },
                                    ]"
                                    class="mb-4"
                                    v-model="type"
                                />

                                <div class="flex items-center justify-end gap-x-2">
                                    <button
                                        type="button"
                                        class="btn btn-primary"
                                        @click="
                                            getData();
                                            close();
                                        "
                                    >
                                        اعمال فیلتر
                                    </button>
                                    <button
                                        type="button"
                                        class="btn btn-outline-primary"
                                        @click="
                                            clearFilter();
                                            close();
                                        "
                                    >
                                        حذف فیلتر
                                    </button>
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
                <input type="text" placeholder="جستجو موکل" class="peer form-input py-2 ltr:pr-11 rtl:pl-11" v-model="search" @input="inputChange" />
                <div class="absolute top-1/2 -translate-y-1/2 peer-focus:text-primary ltr:right-[11px] rtl:left-[11px]">
                    <icon-search class="mx-auto" />
                </div>
            </div>

            <div class="mr-auto flex items-center gap-x-2 rounded border border-info p-1">
                <button
                    type="button"
                    class="btn btn-sm flex items-center gap-x-1 !border-none"
                    :class="tab === 'all' ? 'btn-info' : 'btn-outline-info'"
                    @click="tab = 'all'"
                >
                    <span> همه </span>
                </button>

                <button
                    type="button"
                    class="btn btn-sm flex items-center gap-x-1 !border-none"
                    :class="tab === item.id ? 'btn-info' : 'btn-outline-info'"
                    @click="tab = item.id"
                    v-for="item in enums.status.map((el) => ({ id: el.key, label: el.label }))"
                    :key="item.id"
                >
                    <span>
                        {{ item.label }}
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
                    >
                    <template #action="data">
                        <BaseMultiSelect
                            placeholder="انتخاب کنید"
                            :options="[
                                { name: 'ویرایش', id: 'edit' },
                                { name: 'ثبت سریع واریزی', id: 'transaction' },
                            ]"
                            v-model="data.value.action"
                        >
                        </BaseMultiSelect>
                    </template>
                    <template #date="data">
                        {{ useFormatDate(data.value.created_at, 'numeric') }}
                    </template>
                    <template #time="data">
                        {{ useFormatDate(data.value.created_at, 'time') }}
                    </template>
                    <template #firm="data">
                        {{ data.value.firm?.name }}
                    </template>
                    <template #created_by="data">
                        {{ data.value.created_by?.id }}
                    </template>
                    <template #assignable="data">
                        {{ data.value.assignable?.name }}
                    </template>
                    <template #type="data">
                        {{ data.value.type == '0' ? 'تنظیم اوراق' : 'جلسه رسیدگی' }}
                    </template>
                    <template #status="data">
                        <div v-if="data.value.status" class="mx-auto flex w-1/2 items-center justify-center">
                            <span
                                class="badge rounded-full"
                                :class="
                                    data.value.status === 'pending'
                                        ? 'badge-outline-warning'
                                        : data.value.status === 'in_progress'
                                        ? 'badge-outline-info'
                                        : data.value.status === 'completed'
                                        ? 'badge-outline-success'
                                        : 'badge-outline-danger'
                                "
                            >
                                {{
                                    data.value.status === 'pending'
                                        ? 'در انتظار'
                                        : data.value.status === 'in_progress'
                                        ? 'در حال انجام'
                                        : data.value.status === 'completed'
                                        ? 'تکمیل شده'
                                        : 'لغو شده'
                                }}
                            </span>
                        </div>
                    </template>
                    <template #priority="data">
                        <div v-if="data.value.priority" class="mx-auto flex w-1/2 items-center justify-center">
                            <span
                                class="badge rounded-full"
                                :class="
                                    data.value.priority === 'high'
                                        ? 'badge-outline-primary'
                                        : data.value.priority === 'medium'
                                        ? 'badge-outline-info'
                                        : data.value.priority === 'low'
                                        ? 'badge-outline-warning'
                                        : 'badge-outline-danger'
                                "
                            >
                                {{
                                    data.value.priority === 'high'
                                        ? 'زیاد'
                                        : data.value.priority === 'medium'
                                        ? 'متوسط'
                                        : data.value.priority === 'low'
                                        ? 'کم'
                                        : 'فوری'
                                }}</span
                            >
                        </div>
                    </template>
                </vue3-datatable>

                <div v-if="!rows.length" class="pb-4 text-center">
                    <img src="/empty/task.svg" alt="" class="mx-auto" />

                    <p class="mb-2 font-bold">وظیفه ای برای انجام یافت نشد.</p>
                    <p class="mb-4 text-gray-600">برای مدیریت بهتر کارها، وظایف خود را به این لیست اضافه کنید.</p>

                    <button type="button" class="btn btn-primary mx-auto flex items-center gap-x-1" @click="addNewModal = true">
                        افزودن وظیفه
                        <IconPlus class="ltr:mr-2 rtl:ml-2" />
                    </button>
                </div>
            </div>
        </div>

        <TaskAdd :open="addNewModal" @close="addNewModal = false" @get-data="getData" :enums="enums" :taskUser="taskUser" />
    </div>
</template>

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
