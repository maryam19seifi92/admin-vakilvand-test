<script lang="ts" setup>
    import { ref } from 'vue';

    import { useAppStore } from '@/stores/index';
    const store = useAppStore();
    interface Props {
        open: boolean;
        edit?: boolean;
        countries: { name: string; id: string }[];
        tags: { name: string; id: number; color: string }[];

        type: 'client' | 'lawyer' | 'assistant' | 'opposite';
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'getData'): void;
    }>();

    const errors = ref({});

    const form = ref({
        person_type: 'natural',
        phone: '',
        email: '',
        national_id: '',
        first_name: '',
        last_name: '',
        father_name: '',
        birth_date: new Date(),
        country_id: null,
        province_id: null,
        city_id: null,
        address: '',

        company_name: '',
        company_national_id: '',
        company_registration_id: '',
        ceo_name: '',
        ceo_phone: '',
        reagent: '',
        how_acquainted: '',
        tag_id: '',
        role_id: props.type === 'assistant' ? 4 : props.type === 'client' ? 5 : props.type === 'opposite' ? 6 : props.type === 'lawyer' ? 3 : 5, // default role for client = 5 lawyer = 3  opposite = 6 assistant = 4
    });

    const createClient = async () => {
        try {
            store.toggleLoader(true);

            const data = await useMy$Fetch('/contact', {
                method: 'POST',
                body: form.value,
            });

            store.toggleLoader(false);

            emit('close');
            emit('getData');

            useShowMessage('مخاطب با موفقیت ثبت شد');

            form.value.person_type = 'natural';
            form.value.phone = '';
            form.value.email = '';
            form.value.national_id = '';
            form.value.first_name = '';
            form.value.last_name = '';
            form.value.father_name = '';
            form.value.birth_date = new Date();
            form.value.country_id = null;
            form.value.province_id = null;
            form.value.city_id = null;
            form.value.address = '';
            form.value.company_name = '';
            form.value.company_national_id = '';
            form.value.company_registration_id = '';
            form.value.ceo_name = '';
            form.value.ceo_phone = '';
            form.value.reagent = '';
            form.value.how_acquainted = '';
            form.value.tag_id = '';
            form.value.role_id = props.type === 'assistant' ? 4 : props.type === 'client' ? 5 : props.type === 'opposite' ? 6 : props.type === 'lawyer' ? 3 : 5; // default role for client = 5 lawyer = 3  opposite = 6 assistant = 4
        } catch (err: any) {
            store.toggleLoader(false);

            console.log('err', err.response);

            errors.value = err?.response?._data?.errors;
            console.log('errors', errors.value);
        }
    };

    const provinces = ref([]);
    const cities = ref([]);

    watch(
        () => form.value.country_id,
        async (newValue) => {
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
    );

    watch(
        () => form.value.province_id,
        async (newValue) => {
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
    );
</script>

<template>
    <BaseModal
        :open="open"
        @close="emit('close')"
        :title="
            edit
                ? `ویرایش ${type === 'client' ? 'موکل' : type === 'opposite' ? 'طرف' : type === 'lawyer' ? 'وکیل' : type === 'assistant' ? 'دستیار' : 'موکل'}`
                : `افزودن ${type === 'client' ? 'موکل' : type === 'opposite' ? 'طرف' : type === 'lawyer' ? 'وکیل' : type === 'assistant' ? 'دستیار' : 'موکل'} `
        "
    >
        <form @submit.prevent="createClient">
            <p v-if="type === 'client'" class="">موکل شما شخص حقیقی است یا حقوقی؟</p>
            <div v-if="type === 'client'" class="flex items-center gap-x-2">
                <button
                    type="button"
                    class="btn flex items-center gap-x-1 !border-none"
                    :class="form.person_type === 'natural' ? 'btn-primary' : 'btn-outline-primary'"
                    @click="form.person_type = 'natural'"
                >
                    <IconUser />

                    <span> حقیقی </span>
                </button>
                <button
                    type="button"
                    class="btn flex items-center gap-x-1 !border-none"
                    :class="form.person_type === 'legal' ? 'btn-primary' : 'btn-outline-primary'"
                    @click="form.person_type = 'legal'"
                >
                    <IconCompany />

                    <span>حقوقی</span>
                </button>
            </div>
            <hr class="my-4" />
            <div v-if="form.person_type === 'natural'" class="grid grid-cols-4 gap-3">
                <FormInput type="text" placeholder="" label="نام *" v-model="form.first_name" :error="!!errors.first_name" :hint="errors.first_name" />
                <FormInput type="text" placeholder="" label="نام خانوادگی *" v-model="form.last_name" :error="!!errors.last_name" :hint="errors.last_name" />
                <FormInput type="text" placeholder="" label="نام پدر" v-model="form.father_name" :error="!!errors.father_name" :hint="errors.father_name" />
                <FormInput type="number" placeholder="" label="کد ملی" v-model="form.national_id" :error="!!errors.national_id" :hint="errors.national_id" />
                <FormInput type="tel" placeholder="" label="شماره تماس *" v-model="form.phone" :error="!!errors.phone" :hint="errors.phone" />
                <FormInput type="email" placeholder="" label="ایمیل" v-model="form.email" :error="!!errors.email" :hint="errors.email" />
            </div>
            <div v-else class="grid grid-cols-4 gap-3">
                <FormInput
                    type="text"
                    placeholder=""
                    label="نام شرکت *"
                    v-model="form.company_name"
                    :error="!!errors.company_name"
                    :hint="errors.company_name"
                />
                <FormInput type="text" placeholder="" label="نماینده *" v-model="form.ceo_name" :error="!!errors.company_name" :hint="errors.company_name" />
                <FormInput
                    type="text"
                    placeholder=""
                    label="شناسه ملی *"
                    v-model="form.company_national_id"
                    :error="!!errors.company_national_id"
                    :hint="errors.company_national_id"
                />
                <FormInput
                    type="number"
                    placeholder=""
                    label="شماره ثبت"
                    v-model="form.company_registration_id"
                    :error="!!errors.company_registration_id"
                    :hint="errors.company_registration_id"
                />
                <!-- <FormInput type="text" placeholder="" label="کد اقتصادی" v-model="form.phone" :error="!!errors.company_name" :hint="errors.company_name" /> -->
                <FormInput type="tel" placeholder="" label="شماره تماس *" v-model="form.ceo_phone" :error="!!errors.ceo_phone" :hint="errors.ceo_phone" />
                <FormInput type="email" placeholder="" label="ایمیل" v-model="form.email" :error="!!errors.email" :hint="errors.email" />
            </div>

            <hr class="my-4" />

            <div class="grid grid-cols-4 gap-3">
                <BaseMultiSelect
                    label="کشور"
                    placeholder="کشور را انتخاب کنید"
                    v-model="form.country_id"
                    :options="countries"
                    :error="!!errors.country_id"
                    :hint="errors.country_id"
                />

                <BaseMultiSelect
                    label="استان"
                    placeholder="استان را انتخاب کنید"
                    v-model="form.province_id"
                    :options="provinces"
                    :error="!!errors.province_id"
                    :hint="errors.province_id"
                />

                <BaseMultiSelect
                    label="شهر"
                    placeholder="شهر را انتخاب کنید"
                    v-model="form.city_id"
                    :options="cities"
                    :error="!!errors.city_id"
                    :hint="errors.city_id"
                />
                <FormInput class="col-span-4" type="text" placeholder="" label="آدرس" v-model="form.address" :error="!!errors.address" :hint="errors.address" />
            </div>

            <hr v-if="type === 'client'" class="my-4" />

            <div v-if="type === 'client'" class="grid grid-cols-3 items-end gap-3">
                <BaseMultiSelect
                    label="نحوه آشنایی"
                    placeholder="نحوه آشنایی را انتخاب کنید"
                    v-model="form.how_acquainted"
                    :options="[
                        { label: 'تبلیغات', id: 'outdoor_ads' },
                        { label: 'شبکه های اجتماعی', id: 'social_media' },
                        { label: 'معرف', id: 'referral' },
                        { label: 'گوگل', id: 'google' },
                    ]"
                />

                <FormInput v-if="form.how_acquainted === 'referral'" type="text" placeholder="" label="معرف" v-model="form.reagent" />

                <BaseMultiSelect label="برچسب" placeholder="برچسب را انتخاب کنید" v-model="form.tag_id" :options="tags" />
            </div>

            <div class="mt-8 flex items-center justify-end">
                <button type="button" class="btn btn-outline-danger" @click="emit('close')">انصراف</button>
                <button type="submit" class="btn btn-primary ltr:ml-4 rtl:mr-4">
                    {{ edit ? 'بروزرسانی' : 'افزودن' }}
                </button>
            </div>
        </form>
    </BaseModal>
</template>
