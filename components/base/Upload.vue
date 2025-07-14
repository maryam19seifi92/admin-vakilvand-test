<script setup lang="ts">
    import { ref } from 'vue';
    import { useAppStore } from '@/stores/index';

    const model = defineModel();
    const store = useAppStore();

    interface Props {
        placeholder?: string;
        folder?: string;
        attachment?: boolean;
        inputShape?: boolean;
        disable?: boolean;
        id?: string;
    }

    const props = defineProps<Props>();

    const selectedFile = ref('');

    const emit = defineEmits<{
        (e: 'getFormData', payload: any): void;
    }>();
    const onFileSelected = async (e: any) => {
        selectedFile.value = e.target.files[0];

        let formData = new FormData();

        formData.append('file', selectedFile.value);
        formData.append('folder', props.folder || '/');

        store.toggleLoader(true);

        const { data, error, pending }: any = await useMyFetch('/file-upload', {
            // headers: {
            //   "Content-Type": "multipart/form-data",
            // },
            method: 'POST',
            body: formData,
        });
        store.toggleLoader(false);

        if (data.value) {
            // emit('getFormData', data.value);

            model.value = data.value;
        }
        if (error.value) {
        }
    };
</script>

<template>
    <div :class="[disable ? 'bg-gray-350 flex h-10 items-center px-3' : inputShape ? 'bg-primary-100 flex h-10 items-center px-3' : '']">
        <input type="file" :id="id || 'upload'" accept="image/* ,.doc,.docx,.pdf" @change="onFileSelected" hidden />
        <label class="flex h-full items-center gap-x-2 text-sm" :class="disable ? '' : 'cursor-pointer text-primary'" :for="!disable ? id || 'upload' : ''">
            <icon-plus />

            <span class="text-xs lg:text-sm"> {{ placeholder }}</span>
        </label>
    </div>
</template>
