<template>
    <div :class="{ 'has-error': error }">
        <label :for="id">{{ label }}</label>

        <textarea :id="id" :name="id" class="form-textarea min-h-[130px]" :placeholder="placeholder" v-model="model"></textarea>

        <template v-if="error">
            <p v-for="item in hint" class="mt-1 text-xs text-danger">{{ item }}</p>
        </template>
    </div>
</template>

<script lang="ts" setup>
    interface Props {
        label: string;
        id?: string;
        placeholder: string;
        error?: boolean;
        hint?: string[] | string;
    }

    const props = defineProps<Props>();

    const model = defineModel();
</script>
