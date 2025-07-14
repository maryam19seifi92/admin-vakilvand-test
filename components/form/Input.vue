<template>
    <div :class="{ 'has-error': error }">
        <label v-if="label" :for="id" class="text-sm">{{ label }}</label>
        <input :id="id" :type="type" :placeholder="placeholder" class="form-input" v-model="model" />

        <template v-if="error">
            <p v-for="item in hint" class="mt-1 text-xs text-danger">{{ item }}</p>
        </template>
    </div>
</template>

<script lang="ts" setup>
    interface Props {
        label?: string;
        type: string;
        id?: string;
        placeholder?: string;
        error?: boolean;
        hint?: string[] | string;
    }

    const props = defineProps<Props>();

    const model = defineModel();
</script>
