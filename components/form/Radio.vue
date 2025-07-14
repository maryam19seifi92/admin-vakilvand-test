<template>
    <label class="inline-flex">
        <input :id="id" type="radio" :name="id" class="peer form-radio" v-model="model" :value="value" />
        <span class="peer-checked:text-primary">{{ label }}</span>
    </label>
</template>

<script lang="ts" setup>
    interface Props {
        value: string | boolean;
        id?: string;
        label: string;
        error?: boolean;
        hint?: string[] | string;
    }

    const props = defineProps<Props>();

    const model = defineModel();
</script>
