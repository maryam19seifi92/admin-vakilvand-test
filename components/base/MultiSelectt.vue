<template>
    <multiselect
        :custom-label="nameWithLang"
        v-model="model"
        :options="options"
        :preselect-first="false"
        :allow-empty="true"
        class="custom-multiselect"
        :searchable="false"
        selected-label=""
        select-label=""
        deselect-label=""
        :placeholder="placeholder"
    ></multiselect>
</template>

<script lang="ts" setup>
    import Multiselect from '@suadelabs/vue3-multiselect';
    import '@suadelabs/vue3-multiselect/dist/vue3-multiselect.css';
    const model = defineModel();

    interface Props {
        options: { name: string; id: string }[];
        placeholder?: string;
    }

    const props = defineProps<Props>();
    const emit = defineEmits<{
        (e: 'SearchChange'): void;
    }>();

    const nameWithLang = ({ name }) => {
        return name;
    };
</script>
