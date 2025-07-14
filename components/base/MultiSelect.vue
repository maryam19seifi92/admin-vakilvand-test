<template>
    <div>
        <label v-if="label" class="mb-1.5 inline-block text-sm">
            {{ label }}
        </label>

        <multiselect
            :class="error && !internalValue && 'multiselect multiselect--error'"
            v-model="internalValue"
            :options="options"
            :preselect-first="false"
            track-by="id"
            label="label"
            :allow-empty="true"
            class="custom-multiselect"
            :searchable="false"
            selected-label=""
            select-label=""
            deselect-label=""
            :placeholder="placeholder"
            :multiple="multiple"
        >
            <template #noOptions> لیست خالیه! </template>
        </multiselect>

        <template v-if="error && !internalValue">
            <p v-for="item in hint" class="mt-1 text-xs text-danger">{{ item }}</p>
        </template>
    </div>
</template>

<script setup>
    import { computed } from 'vue';
    import Multiselect from '@suadelabs/vue3-multiselect';
    import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';

    // Props
    const props = defineProps({
        modelValue: [Number, String, Array, null],
        label: String,
        error: Boolean,
        hint: String,
        options: {
            type: Array,
            required: true,
        },
        multiple: {
            type: Boolean,
            default: false,
        },
        placeholder: {
            type: String,
            default: 'انتخاب کنید',
        },
    });

    // Emits
    const emit = defineEmits(['update:modelValue']);

    // تبدیل مدل ورودی به آبجکت (برای نمایش)
    const internalValue = computed({
        get() {
            if (props.multiple) {
                return props.options.filter((opt) => props.modelValue?.includes(opt.id));
            } else {
                return props.options.find((opt) => opt.id === props.modelValue) || null;
            }
        },
        set(val) {
            if (props.multiple) {
                emit(
                    'update:modelValue',
                    val.map((v) => v.id)
                );
            } else {
                emit('update:modelValue', val?.id ?? null);
            }
        },
    });
</script>

<style scoped>
    :deep(.multiselect--error) .multiselect__tags {
        border: 1px solid rgb(231 81 90) !important;
        background-color: rgba(231, 81, 90, 0.06) !important;
        color: rgb(231 81 90) !important;
    }
</style>
