<template>
    <label class="inline-flex">
        <input type="checkbox" class="form-checkbox" :checked="modelValue" @change="handleChange" />
        <span class="text-sm">{{ label }}</span>
    </label>
</template>

<script lang="ts" setup>
    interface Props {
        value?: string | boolean;
        id?: string;
        label: string;
        error?: boolean;
        hint?: string[] | string;
        modelValue: boolean;
    }

    const props = defineProps<Props>();

    const emit = defineEmits(['update:modelValue']);

    const handleChange = (event) => {
        emit('update:modelValue', event.target.checked);
    };
</script>
