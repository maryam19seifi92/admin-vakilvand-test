<script lang="ts" setup>
    import { ref } from 'vue';

    import { useAppStore } from '@/stores/index';

    const store = useAppStore();
    interface Props {
        open: boolean;
        edit?: boolean;
        countries: { name: string; id: string }[];
        categories: { name: string; id: string }[];
        // lawyers: { name: string; id: string }[];
        stages: { name: string; id: string }[];
        clients: { name: string; id: string }[];
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'getData'): void;
    }>();

    const addContactModal = ref(false);
    const contactType = ref('');

    const openClientModal = () => {
        addContactModal.value = true;
        contactType.value = 'client';
    };

    const openOppositeModal = () => {
        addContactModal.value = true;
        contactType.value = 'opposite';
    };
    const openLawyerModal = () => {
        addContactModal.value = true;
        contactType.value = 'lawyer';
    };
    const openAssistantModal = () => {
        addContactModal.value = true;
        contactType.value = 'assistant';
    };

    const { data: tags, refresh: refreshTag } = await useMyFetch('/tag', {
        transform: (result) => {
            return result.map((p) => ({ id: p.id, label: p.name, ...p }));
        },
    });

    const { data: lawyers } = await useMyFetch('/matter-case/lawyers', {
        transform: (result) => {
            return result.map((p) => ({ share_percentage: 0, id: p.id, label: p.user?.name || '', ...p }));
        },
    });
    const { data: assistants } = await useMyFetch('/matter-case/assistants', {
        transform: (result) => {
            return result.map((p) => ({ share_percentage: 0, id: p.id, label: p.user?.name || '', ...p }));
        },
    });
    // const { data: categories } = await useMyFetch('/matter-case/categories', {
    //     transform: (result) => {
    //         return result.map((p) => ({ id: p.id, label: p.name, ...p }));
    //     },
    // });
    const { data: opposite } = await useMyFetch('/matter-case/opposite-users', {
        transform: (result) => {
            return result.map((p) => ({ id: p.id, label: p.user?.name || '', ...p }));
        },
    });
    // const { data: stages } = await useMyFetch('/matter-case/stages', {
    //     transform: (result) => {
    //         return result.map((p) => ({ id: p.id, label: p.name, ...p }));
    //     },
    // });
    // const { data: clients } = await useMyFetch('/contact', {
    //     transform: (result) => {
    //         return result.data.map((p) => ({ id: p.id, label: p.firm_specific_display_name, ...p }));
    //     },
    // });

    const provinces = ref([]);
    const cities = ref([]);
    const courts = ref([]);

    const selectedClient = ref([]);
    const selectedOpposite = ref([]);
    const selectedLawyer = ref([]);
    const selectedAssitant = ref([]);

    const form = ref({
        title: '',
        description: '',
        category_id: '',
        sub_category_id: '',
        stage_id: '',
        court_id: '',
        cms_number: '',
        office_archive: '',
        council_archive: '',
        court_archive: '',
        supreme_court_archive: '',
        prosecutor_archive: '',
        court_archive_number: '',
        appeal_court_archive: '',
        created_by_firm_user_id: '',

        clients: [],
        participants: [],

        province_id: '',
        city_id: '',

        notify_clients: false,
        notify_assistants: false,
        notify_lawyers: false,

        fee_type: 'fixed',
        total_amount: '',
        down_payment: '',
        document: [{ name: '', file: '' }],
    });

    const getProveinces = async () => {
        try {
            store.toggleLoader(true);

            const data = await useMy$Fetch(`/provinces/1`);

            provinces.value = data?.map((el) => ({ id: el.id, label: el.name }));

            store.toggleLoader(false);

            form.value.province_id = null;
        } catch (err: any) {
            store.toggleLoader(false);
        }
    };

    getProveinces();

    watch(
        () => form.value.province_id,
        async (newValue) => {
            if (newValue) {
                try {
                    store.toggleLoader(true);

                    const data = await useMy$Fetch(`/cities/${newValue}`);

                    cities.value = data?.map((el) => ({ id: el.id, label: el.name }));

                    store.toggleLoader(false);

                    form.value.city_id = null;
                } catch (err: any) {
                    store.toggleLoader(false);
                }
            }
        }
    );

    watch(
        () => form.value.city_id,
        async (newValue) => {
            if (newValue) {
                try {
                    store.toggleLoader(true);

                    const data = await useMy$Fetch(`/matter-case/courts/${newValue}`);

                    courts.value = data?.map((el) => ({ id: el.id, label: el.name }));

                    store.toggleLoader(false);

                    form.value.court_id = null;
                } catch (err: any) {
                    store.toggleLoader(false);
                }
            }
        }
    );

    watch(
        () => form.value.case_category_id,
        async (newValue) => {
            if (newValue) {
                try {
                    store.toggleLoader(true);

                    const data = await useMy$Fetch(`/provinces/${newValue}`);

                    provinces.value = data?.map((el) => ({ id: el.id, label: el.name }));

                    store.toggleLoader(false);

                    form.value.province_id = null;
                } catch (err: any) {
                    store.toggleLoader(false);
                }
            }
        }
    );

    const errors = ref({});

    const createMatter = async () => {
        try {
            store.toggleLoader(true);

            const data = await useMy$Fetch('/matter', {
                method: 'POST',
                body: form.value,
            });

            store.toggleLoader(false);

            emit('close');
            emit('getData');

            useShowMessage('پرونده با موفقیت ثبت شد');
        } catch (err: any) {
            store.toggleLoader(false);

            console.log('err', err.response);

            errors.value = err?.response?._data?.errors;
            console.log('errors', errors.value);
        }
    };

    const equalShare = ref(false);

    const participants = computed(() => {
        let participantList = [];

        selectedLawyer.value.forEach((el) => {
            let item = lawyers.value.find((res) => res.id === el);
            participantList.push(item);
        });
        selectedAssitant.value.forEach((el) => {
            let item = assistants.value.find((res) => res.id === el);

            participantList.push(item);
        });

        return participantList;
    });

    const setSharePercentage = () => {
        if (equalShare.value) {
            let number = participants.value.length;
            let amount = form.value.fee_type === 'fixed' ? form.value.total_amount / number : 100 / number;

            participants.value.forEach((p) => {
                p.share_percentage = amount;
            });
        } else {
            participants.value.forEach((p) => {
                p.share_percentage = 0;
            });
        }
    };

    watch(equalShare, (newVal, oldVal) => {
        setSharePercentage();
        // if (newVal) {
        //     let number = participants.value.length;
        //     let amount = form.value.fee_type === 'fixed' ? form.value.total_amount / number : 100 / number;

        //     participants.value.forEach((p) => {
        //         p.share_percentage = amount;
        //     });
        // } else {
        //     participants.value.forEach((p) => {
        //         p.share_percentage = 0;
        //     });
        // }
    });

    watch(
        () => form.value.total_amount,
        (newValue) => {
            setSharePercentage();
        }
    );
    watch(
        () => form.value.fee_type,
        (newValue) => {
            setSharePercentage();
        }
    );
</script>

<template>
    <BaseModal :open="open" @close="emit('close')" :title="edit ? 'ویرایش پرونده' : 'افزودن پرونده '">
        <form @submit.prevent="createMatter">
            <p class="font-bold">اطلاعات</p>

            <BaseMultiSelect
                multiple
                label="موکل/موکلین *"
                placeholder="نام موکل خود را انتخاب کنید"
                :options="clients"
                class="mb-2"
                v-model="selectedClient"
            />

            <button @click="openClientModal" type="button" class="btn btn-primary mb-3 flex items-center gap-x-1">
                افزودن موکل
                <IconPlus class="ltr:mr-2 rtl:ml-2" />
            </button>
            <BaseMultiSelect
                multiple
                label="طرف/طرفین "
                placeholder=" طرف/طرفین  خود را انتخاب کنید"
                :options="opposite"
                class="mb-2"
                v-model="selectedOpposite"
            />

            <button @click="openOppositeModal" type="button" class="btn btn-primary mb-3 flex items-center gap-x-1">
                افزودن طرف/طرفین
                <IconPlus class="ltr:mr-2 rtl:ml-2" />
            </button>

            <FormTextarea
                label="توضیحات"
                placeholder="توضیحات وظیفه خود را بنویسید"
                v-model="form.description"
                :error="!!errors.description"
                :hint="errors.description"
            />

            <div class="grid grid-cols-2 gap-4">
                <BaseMultiSelect multiple label="وکیل مسئول *" placeholder="" :options="lawyers" v-model="selectedLawyer" />
                <button @click="openLawyerModal" type="button" class="btn btn-primary flex h-10 w-fit items-center gap-x-1 self-end">
                    افزودن وکیل
                    <IconPlus class="ltr:mr-2 rtl:ml-2" />
                </button>

                <BaseMultiSelect multiple label="دستیار وکیل *" placeholder="" :options="assistants" v-model="selectedAssitant" />
                <button @click="openAssistantModal" type="button" class="btn btn-primary flex h-10 w-fit items-center gap-x-1 self-end">
                    افزودن دستیار
                    <IconPlus class="ltr:mr-2 rtl:ml-2" />
                </button>

                <FormInput
                    type="text"
                    label="نام پرونده "
                    placeholder="لطفا نام پرونده را وارد کنید"
                    v-model="form.title"
                    :error="!!errors.title"
                    :hint="errors.title"
                />

                <BaseMultiSelect
                    label="موضوع پرونده *"
                    placeholder=""
                    :options="categories"
                    v-model="form.category_id"
                    :error="!!errors.category_id"
                    :hint="errors.category_id"
                />
                <BaseMultiSelect
                    label="زیر دسته بندی"
                    placeholder=""
                    :options="categories"
                    v-model="form.sub_category_id"
                    :error="!!errors.sub_category_id"
                    :hint="errors.sub_category_id"
                />

                <BaseMultiSelect
                    label="مرحله رسیدگی "
                    placeholder=""
                    :options="stages"
                    v-model="form.stage_id"
                    :error="!!errors.stage_id"
                    :hint="errors.stage_id"
                />
                <FormInput
                    type="text"
                    placeholder="لطفا شماره CMS پرونده را وارد کنید"
                    label="شماره CMS پروند"
                    v-model="form.cms_number"
                    :error="!!errors.cms_number"
                    :hint="errors.cms_number"
                />
                <BaseMultiSelect
                    label="استان"
                    placeholder=""
                    :options="provinces"
                    v-model="form.province_id"
                    :error="!!errors.province_id"
                    :hint="errors.province_id"
                />
                <BaseMultiSelect label="شهر" placeholder="" :options="cities" v-model="form.city_id" :error="!!errors.city_id" :hint="errors.city_id" />
                <BaseMultiSelect
                    label="محل رسیدگی"
                    placeholder=""
                    :options="courts"
                    v-model="form.court_id"
                    :error="!!errors.court_id"
                    :hint="errors.court_id"
                />
                <FormInput
                    type="text"
                    label="شماره بایگانی دادگاه  "
                    placeholder="لطفا شماره بایگانی را وارد کنید"
                    v-model="form.court_archive_number"
                    :error="!!errors.court_archive_number"
                    :hint="errors.court_archive_number"
                />
                <FormInput
                    type="text"
                    label="شماره بایگانی دفتر وکیل "
                    placeholder="لطفا شماره بایگانی را وارد کنید"
                    v-model="form.office_archive"
                    :error="!!errors.office_archive"
                    :hint="errors.office_archive"
                />
                <FormInput
                    type="text"
                    label="شماره بایگانی شورا حل اختلاف"
                    placeholder="لطفا شماره بایگانی را وارد کنید"
                    v-model="form.council_archive"
                    :error="!!errors.council_archive"
                    :hint="errors.council_archive"
                />
                <FormInput
                    type="text"
                    label="شماره بایگانی دادگاه کیفری"
                    placeholder="لطفا شماره بایگانی را وارد کنید"
                    v-model="form.court_archive"
                    :error="!!errors.court_archive"
                    :hint="errors.court_archive"
                />
                <FormInput
                    type="text"
                    label="شماره بایگانی دیوان عالی"
                    placeholder="لطفا شماره بایگانی را وارد کنید"
                    v-model="form.supreme_court_archive"
                    :error="!!errors.supreme_court_archive"
                    :hint="errors.supreme_court_archive"
                />
                <FormInput
                    type="text"
                    label="شماره بایگانی دادسرا "
                    placeholder="لطفا شماره بایگانی را وارد کنید"
                    v-model="form.prosecutor_archive"
                    :error="!!errors.prosecutor_archive"
                    :hint="errors.prosecutor_archive"
                />
                <FormInput
                    type="text"
                    label="شماره بایگانی دیوان عدالت اداری"
                    placeholder="لطفا شماره بایگانی را وارد کنید"
                    v-model="form.title"
                    :error="!!errors.title"
                    :hint="errors.title"
                />
                <FormInput
                    type="text"
                    label="شماره بایگانی تجدید نظر"
                    placeholder="لطفا شماره بایگانی را وارد کنید"
                    v-model="form.appeal_court_archive"
                    :error="!!errors.appeal_court_archive"
                    :hint="errors.appeal_court_archive"
                />
            </div>

            <hr class="my-4" />

            <p class="mb-3 font-bold">حق الزحمه وکیل</p>

            <p class="mb-3 font-bold">
                با ثبت مبلغ و نحوه پرداخت حق‌الوکاله، امکان مدیریت مالی دقیق پرونده، اطلاع‌رسانی زمان‌های پرداخت و ایجاد شفافیت مالی برای وکیل فراهم می‌شود.
                همچنین در صورت وجود چند وکیل در یک پرونده، سهم هر یک به‌صورت خودکار محاسبه خواهد شد.
            </p>

            <div class="mb-4 grid grid-cols-5 gap-4">
                <BaseMultiSelect
                    label="نوع حق الزحمه"
                    placeholder=""
                    :options="[
                        { id: 'fixed', label: 'ثابت' },
                        { id: 'percentage', label: 'درصدی' },
                    ]"
                    v-model="form.fee_type"
                />
                <FormInput
                    type="number"
                    label="مبلغ کل حق الزحمه"
                    placeholder=""
                    v-model="form.total_amount"
                    :error="!!errors.total_amount"
                    :hint="errors.total_amount"
                />

                <FormPriceInput
                    label="مبلغ کل حق الزحمه"
                    placeholder=""
                    v-model="form.total_amount"
                    :error="!!errors.total_amount"
                    :hint="errors.total_amount"
                />

                <!-- <BaseMultiSelect label="نحوه پرداخت" placeholder="" :options="[]" /> -->
                <!-- <BaseMultiSelect label="مراحل پرداخت" placeholder="" :options="[]" /> -->
                <FormInput
                    type="number"
                    label="پیش پرداخت"
                    placeholder=""
                    v-model="form.down_payment"
                    :error="!!errors.down_payment"
                    :hint="errors.down_payment"
                />
            </div>

            <p class="mb-3 font-bold">لطفا درصد سهم هر یک از وکلا را انتخاب نمایید.</p>

            <div class="grid grid-cols-4 gap-3">
                <template v-for="(item, index) in participants" :key="item.id">
                    <FormInput
                        type="number"
                        placeholder=""
                        v-model="item.share_percentage"
                        :label="`سهم ${item.role_id === '4' ? 'دستیار' : 'وکیل'} (${item.label})`"
                    />
                </template>

                <FormCheckbox label="محاسبه سهم وکلا بالمساوی" class="self-end" v-model="equalShare" />
            </div>

            <hr class="my-4" />

            <p class="mb-3 font-bold">بارگذاری مدارک</p>
            <p class="mb-3 font-bold">برای سهولت در مدیریت و دسترسی بهتر به پرونده دیجیتال، در صورت تمایل می‌توانید مدارک خود را بارگذاری فرمایید.</p>
            <p class="mb-3 text-sm">
                شایان ذکر است تمامی اطلاعات ارسالی با استفاده از سیستم‌های رمزنگاری پیشرفته محافظت شده و دسترسی سایر اعضای مرتبط با پرونده، صرفاً با تأیید و
                مجوز شما امکان‌پذیر خواهد بود.
            </p>

            <div class="grid grid-cols-3 gap-4" v-for="item in form.document">
                <FormInput type="text" label="عنوان مدرک" placeholder="عنوان مدرک" v-model="item.name" :error="!!errors.name" :hint="errors.name" />

                <BaseUpload placeholder="انتخاب مدرک" v-model="item.file" folder="matter" />
            </div>

            <button type="button" class="btn btn-primary flex h-10 w-fit items-center gap-x-1 self-end">
                مدرک جدید
                <IconPlus class="ltr:mr-2 rtl:ml-2" />
            </button>

            <hr class="my-4" />
            <p class="mb-3 font-bold">اطلاع رسانی اقدامات</p>

            <p class="text-sm">آیا مایل هستید در راستای بهبود تجربه کاری موکل با شما، پس از انجام هر اقدام ، گزارش کار به موکل اطلاع رسانی شود؟</p>

            <div class="my-3 flex items-center justify-center gap-x-5">
                <FormRadio id="notify_clients" :value="true" label="بله" v-model="form.notify_clients" />
                <FormRadio id="notify_clientsn" :value="false" label="خیر" v-model="form.notify_clients" />
            </div>
            <p class="text-sm">آیا مایل هستید در راستای ارتباط کاری هماهنگ شما با دستیار خود ، پس از انجام هر اقدام ، گزارش کار به اطلاع ایشان برسد؟</p>

            <div class="my-3 flex items-center justify-center gap-x-5">
                <FormRadio id="notify_assistants" :value="true" label="بله" v-model="form.notify_assistants" />
                <FormRadio id="notify_assistantsn" :value="false" label="خیر" v-model="form.notify_assistants" />
            </div>
            <p class="text-sm">آیا مایل هستید در راستای مدیریت پرونده ها و اقدامات آتی خود ، قبل از انجام هر اقدام ، از طریق ایمیل به شما اطلاع ایشان شود؟</p>

            <div class="my-3 flex items-center justify-center gap-x-5">
                <FormRadio :value="true" label="بله" v-model="form.notify_lawyers" />
                <FormRadio :value="false" label="خیر" v-model="form.notify_lawyers" />
            </div>

            <div class="mt-8 flex items-center justify-end">
                <button type="button" class="btn btn-outline-danger" @click="emit('close')">انصراف</button>
                <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                    {{ edit ? 'بروزرسانی' : 'افزودن' }}
                </button>
            </div>
        </form>

        <ClientAddClient :type="contactType" :open="addContactModal" @close="addContactModal = false" :countries="countries" :tags="tags" @get-data="getData" />
    </BaseModal>
</template>
