<script lang="ts" setup>
    import { ref } from 'vue';

    import { useAppStore } from '@/stores/index';
    const store = useAppStore();
    interface Props {
        open: boolean;
        edit?: boolean;

        enums: [];
        taskUser: [];
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'getData'): void;
    }>();

    // const { data: enums } = await useMyFetch('/task-enums');
    // const { data: taskUser } = await useMyFetch('/task-users');
    const { data: matters } = await useMyFetch('/task-matters');
    const { data: contact } = await useMyFetch('/contact');

    const errors = ref({});

    const setReminder = ref(false);

    const form = ref({
        title: '',
        description: '',
        priority: null,
        status: 'pending',
        notify_assignee_client: false,
        type: '',
        assignable_id: '',
        assignable_type: 'App\Models\CaseFile',
        case_file_id: '',
        client_notification_method: '',
        client_notification_time: '',
        time: '',
        time_type: '',
        related_model_id: '',
        related_model_type: 'App\Models\User',
        due_date: '',
    });

    const createClient = async () => {
        try {
            store.toggleLoader(true);

            form.value.client_notification_time = form.value.time + form.value.time_type;

            const data = await useMy$Fetch('/task', {
                method: 'POST',
                body: form.value,
            });

            store.toggleLoader(false);

            emit('close');
            emit('getData');

            useShowMessage('وظیفه با موفقیت ثبت شد');
        } catch (err: any) {
            store.toggleLoader(false);

            console.log('err', err.response);

            errors.value = err?.response?._data?.errors;
            console.log('errors', errors.value);
        }
    };
</script>

<template>
    <BaseModal :open="open" @close="emit('close')" :title="edit ? 'ویرایش وظیفه' : 'افزودن وظیفه '">
        <form @submit.prevent="createClient">
            <p class="font-bold">اطلاعات</p>

            <div class="grid grid-cols-2 gap-3">
                <FormInput
                    type="text"
                    placeholder="عنوان وظیفه خود را بنویسید"
                    label="عنوان*"
                    v-model="form.title"
                    :error="!!errors.title"
                    :hint="errors.title"
                />

                <BaseMultiSelect
                    label="اولویت"
                    placeholder="اولویت"
                    v-model="form.priority"
                    :options="enums.priority.map((el) => ({ id: el.key, label: el.label }))"
                    :error="!!errors.priority"
                    :hint="errors.priority"
                />

                <BaseMultiSelect
                    label="نوع وظیفه *"
                    placeholder="انتخاب نوع وظیفه"
                    v-model="form.type"
                    :options="[
                        { label: 'تنظیم اوراق', id: '0' },
                        { label: 'جلسه رسیدگی', id: '1' },
                    ]"
                    :error="!!errors.type"
                    :hint="errors.type"
                />

                <FormTextarea
                    label="توضیحات"
                    placeholder="توضیحات وظیفه خود را بنویسید"
                    v-model="form.description"
                    class="col-span-2"
                    :error="!!errors.description"
                    :hint="errors.description"
                />

                <BaseMultiSelect
                    label="مسئول وظیفه *"
                    placeholder=""
                    v-model="form.assignable_id"
                    :options="taskUser.map((el) => ({ label: el.user?.name, id: el.id }))"
                    :error="!!errors.assignable_id"
                    :hint="errors.assignable_id"
                />
                <BaseMultiSelect
                    label="وضعیت"
                    placeholder=""
                    v-model="form.status"
                    :options="enums.status.map((el) => ({ id: el.key, label: el.label }))"
                    :error="!!errors.status"
                    :hint="errors.status"
                />
                <BaseMultiSelect
                    label="موکل"
                    placeholder=""
                    v-model="form.related_model_id"
                    :options="contact.data.map((el) => ({ label: el.firm_specific_display_name, id: el.id }))"
                    :error="!!errors.status"
                    :hint="errors.status"
                />
                <BaseMultiSelect
                    label="پرونده"
                    placeholder=""
                    v-model="form.case_file_id"
                    :options="matters.data.map((el) => ({ label: el.case_name, id: el.id }))"
                    :error="!!errors.case_file_id"
                    :hint="errors.case_file_id"
                />

                <BaseDatePicker type="datetime" v-model="form.due_date" />

                <div class="col-span-2">
                    <p class="text-sm text-gray-700">
                        آیا مایل هستید در راستای بهبود تجربه کاری موکل با شما پس از انجام وظیفه، گزارش کار به موکل اطلاع رسانی شود؟
                    </p>

                    <div class="flex items-center justify-center gap-x-5 py-4">
                        <FormRadio v-model="form.notify_assignee_client" label="بله" :value="true" />
                        <FormRadio v-model="form.notify_assignee_client" label="خیر" :value="false" />
                    </div>

                    <div class="">
                        <p class="mb-2 font-bold">یادآوری</p>

                        <div class="flex items-center gap-x-3" v-if="setReminder">
                            <BaseMultiSelect
                                label=""
                                :options="enums.client_notification_method.map((el) => ({ id: el.key, label: el.label }))"
                                v-model="form.client_notification_method"
                                :error="!!errors.client_notification_method"
                                :hint="errors.client_notification_method"
                            />

                            <FormInput
                                v-if="form.client_notification_method !== 'none'"
                                type="number"
                                v-model="form.client_notification_time"
                                :error="!!errors.client_notification_time"
                                :hint="errors.client_notification_time"
                            />
                            <BaseMultiSelect
                                v-if="form.client_notification_method !== 'none'"
                                label=""
                                :options="[
                                    { id: 'min', label: 'دقیقه' },
                                    { id: 'hour', label: 'ساعت' },
                                ]"
                                v-model="form.time_type"
                                :error="!!errors.client_notification_time"
                                :hint="errors.client_notification_time"
                            />

                            <span v-if="form.client_notification_method !== 'none'">مانده به وظیفه</span>
                        </div>

                        <div v-else class="flex items-center justify-between">
                            <div class="">
                                <p class="mb-4">شما برنامه یادآوری برای این وظیفه تنظیم نکرده اید.</p>
                                <button type="button" class="btn btn-outline-danger" @click="setReminder = true">
                                    <span>افزودن یادآور</span>

                                    <IconPlus />
                                </button>
                            </div>

                            <img src="/img/bell.svg" alt="" />
                        </div>
                    </div>
                </div>
            </div>

            <hr class="my-4" />

            <div class=""></div>

            <div class="mt-8 flex items-center justify-end">
                <button type="button" class="btn btn-outline-danger" @click="emit('close')">انصراف</button>
                <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                    {{ edit ? 'بروزرسانی' : 'افزودن' }}
                </button>
            </div>
        </form>
    </BaseModal>
</template>
