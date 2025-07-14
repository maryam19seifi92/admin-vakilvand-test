<script setup lang="ts">
    import { ref } from 'vue';
    import type { Ref } from 'vue';

    interface Props {
        modelValue: any;
        error?: boolean;
        label?: string;
        hint?: string;
        type?: string;
        range?: boolean;
        min?: string;
    }

    const props = defineProps<Props>();

    const emit = defineEmits<{
        (e: 'update:modelValue', date: any): void;

        (e: 'onChange', $event: any): void;
    }>();

    import DatePicker from 'vue3-persian-datetime-picker';

    const val = ref(props.modelValue);

    const calendar: Ref<any> = ref(null);

    const openCalendar = () => {
        calendar.value?.focus();
    };

    const goToToday = () => {
        calendar.value?.goToday();
        calendar.value?.submit();
        emit('update:modelValue', val.value);
    };

    const onChange = (e) => {
        emit('update:modelValue', val.value);
        emit('onChange', e);
    };
</script>

<template>
    <div class="">
        <label v-if="label">
            {{ label }}
        </label>
        <div class="flex w-full items-center rounded-lg border p-1" :class="error && 'border-danger bg-danger-light'">
            <label class="flex cursor-pointer items-center" @click="openCalendar">
                <IconCalendar />
            </label>
            <ClientOnly>
                <date-picker
                    v-if="type"
                    :min="min"
                    :range="range"
                    :type="type"
                    ref="calendar"
                    :autoSubmit="true"
                    class="flex-1 text-xs"
                    display-format="dddd jDD jMMMM  HH:mm"
                    format="YYYY-MM-DD HH:mm"
                    v-model="val"
                    @change="onChange"
                ></date-picker>
                <date-picker
                    v-else
                    :range="range"
                    ref="calendar"
                    :min="min"
                    :autoSubmit="true"
                    class="flex-1 text-xs"
                    display-format="dddd jDD jMMMM"
                    format="YYYY-MM-DD"
                    v-model="val"
                    @change="onChange"
                ></date-picker>
            </ClientOnly>
        </div>
        <p class="text-xs text-danger">{{ hint }}</p>
    </div>
</template>

<style>
    .vpd-day-effect {
        border-radius: 0 !important;
    }

    .vpd-icon-btn {
        display: none !important;
    }

    .vpd-input-group .form-control {
        border: none !important;
        background-color: transparent;
    }
    /* Date Picker */

    .vpd-day-effect {
        /* border-radius: 0 !important; */
    }

    .vpd-icon-btn {
        display: none !important;
    }

    .vpd-input-group .form-control {
        /* border: none !important; */
        background-color: transparent;
    }
</style>
