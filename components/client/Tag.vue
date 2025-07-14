<script lang="ts" setup>
    import { ref } from 'vue';

    import { useAppStore } from '@/stores/index';
    const store = useAppStore();
    interface Props {
        open: boolean;
        edit?: boolean;
        tags: { name: string; id: number; color: string }[];
    }

    const props = defineProps<Props>();

    const tagList = ref(props.tags);

    const emit = defineEmits<{
        (e: 'close'): void;
        (e: 'updateTag'): void;
    }>();

    const colorList = ref([
        {
            id: 'brown',
            value: '#964B00',
        },
        {
            id: 'pink',
            value: '#FF8DA1',
        },
        {
            id: 'blue',
            value: '#0000CD',
        },
        {
            id: 'light_blue',
            value: '#90D5FF',
        },
        {
            id: 'red',
            value: '#FA5053',
        },
        {
            id: 'green',
            value: '#008000',
        },
        {
            id: 'light_green',
            value: '#89F336',
        },
        {
            id: 'orange',
            value: '#FF7518',
        },
        {
            id: 'dark_blue',
            value: '#272757',
        },
        {
            id: 'gray',
            value: '#6D8196',
        },
        {
            id: 'purple',
            value: '#873260',
        },
        {
            id: 'light_purple',
            value: '#9D00FF',
        },
    ]);

    const errors = ref({});

    const form = ref({
        color: 'green',
        name: '',
    });

    const createTag = async () => {
        try {
            store.toggleLoader(true);

            const data = await useMy$Fetch('/tag', {
                method: 'POST',
                body: form.value,
            });

            store.toggleLoader(false);
            emit('updateTag');
            form.value.color = 'green';
            form.value.name = '';
        } catch (err: any) {
            store.toggleLoader(false);

            console.log('err', err.response);

            errors.value = err?.response?._data?.errors;
            console.log('errors', errors.value);
        }
    };

    const readyToAction = (index: number, action: 'remove' | 'edit') => {
        tagList.value = tagList.value.map((el) => ({ ...el, editAlert: false, removeAlert: false }));

        if (action === 'remove') {
            tagList.value[index].removeAlert = true;
            tagList.value[index].editAlert = false;
        } else {
            tagList.value[index].editAlert = true;
            tagList.value[index].removeAlert = false;
        }
    };

    const cancelRemove = (index: number) => {
        tagList.value[index].removeAlert = false;
    };
    const cancelEdit = (index: number) => {
        tagList.value[index].editAlert = false;
    };

    const removeTag = async (id: number) => {
        try {
            store.toggleLoader(true);

            const data = await useMy$Fetch(`/tag/${id}`, {
                method: 'DELETE',
            });

            store.toggleLoader(false);
            emit('updateTag');
        } catch (err: any) {
            store.toggleLoader(false);
        }
    };

    const editTag = async (tag: { id: number; name: string; color: string }) => {
        try {
            store.toggleLoader(true);

            const data = await useMy$Fetch(`/tag/${tag.id}`, {
                method: 'PUT',
                body: {
                    name: tag.name,
                    color: tag.color,
                },
            });

            store.toggleLoader(false);
            emit('updateTag');
        } catch (err: any) {
            store.toggleLoader(false);

            console.log('err', err.response);

            errors.value = err?.response?._data?.errors;
            console.log('errors', errors.value);
        }
    };

    const colseModal = () => {
        tagList.value = tagList.value.map((el) => ({ ...el, editAlert: false, removeAlert: false }));

        emit('close');
    };
</script>

<template>
    <BaseModal :open="open" @close="colseModal" title="مدیریت برچسب‌ها">
        <form @submit.prevent="createTag">
            <p class="mb-1 font-bold">برچسب‌ها به شما کمک می‌کنن تا مخاطبین‌تون رو دسته‌بندی کرده و راحت‌تر پیداشون کنین.</p>
            <p class="mb-3 text-gray-600">
                اگه از برچسب‌های کوتاه استفاده کنین و تعداد برچسب‌هایی که در شرکت به کار می‌برین رو محدود نگه دارین، این دسته‌بندی کارآمدتر و مؤثرتر خواهد بود.
            </p>

            <p class="mb-1 text-sm">ساخت برچسب جدید</p>

            <div class="mb-3 flex w-10/12 items-center">
                <div class="dropdown">
                    <client-only>
                        <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="0" class="align-middle">
                            <button
                                type="button"
                                class="flex h-9 items-center rounded-r-md border border-l-0 border-[#e0e6ed] px-4 text-sm font-semibold dark:border-[#253b5c] dark:bg-[#1b2e4b] dark:text-white-dark"
                            >
                                <div class="h-5 w-5 rounded-full" :class="form.color"></div>
                            </button>
                            <template #content="{ close }">
                                <div class="grid w-32 grid-cols-4 gap-3 border bg-white p-4">
                                    <button type="button" class="h-3.5 w-3.5" v-for="item in colorList" :class="item.id" @click="form.color = item.id"></button>
                                </div>
                            </template>
                        </Popper>
                    </client-only>
                </div>

                <input
                    type="text"
                    placeholder="عنوان برچسب را وارد کنید"
                    class="h-9 flex-1 rounded-l-md border border-[#e0e6ed] px-3 focus:outline-none"
                    v-model="form.name"
                />

                <button type="submit" class="btn mr-3" @click="createTag">ایجاد برچسب</button>
            </div>

            <div class="" v-if="tags.length">
                <p class="mb-1 text-sm">مدیریت برچسب ها</p>

                <template v-for="(tag, index) in tagList" :key="tag.id">
                    <div class="mb-2 flex w-10/12 items-center">
                        <div class="dropdown">
                            <client-only>
                                <Popper :placement="store.rtlClass === 'rtl' ? 'bottom-start' : 'bottom-end'" offsetDistance="0" class="align-middle">
                                    <button
                                        type="button"
                                        class="flex h-9 items-center rounded-r-md border border-l-0 border-[#e0e6ed] px-4 text-sm font-semibold dark:border-[#253b5c] dark:bg-[#1b2e4b] dark:text-white-dark"
                                    >
                                        <div class="h-5 w-5 rounded-full" :class="tag.color"></div>
                                    </button>

                                    <template #content="{ close }">
                                        <div class="grid w-32 grid-cols-4 gap-3 border bg-white p-4">
                                            <button
                                                type="button"
                                                class="h-3.5 w-3.5"
                                                v-for="item in colorList"
                                                :class="item.id"
                                                @click="tagList[index].color = item.id"
                                            ></button>
                                        </div>
                                    </template>
                                </Popper>
                            </client-only>
                        </div>

                        <input
                            type="text"
                            placeholder="عنوان برچسب را وارد کنید"
                            class="h-9 flex-1 rounded-l-md border border-[#e0e6ed] px-3 focus:outline-none"
                            v-model="tag.name"
                        />

                        <div class="mr-3 flex items-center gap-x-2">
                            <button type="button" @click="readyToAction(index, 'edit')" class="hover:text-primary">
                                <IconEdit />
                            </button>
                            <button type="button" @click="readyToAction(index, 'remove')" class="hover:text-danger">
                                <IconTrashLines />
                            </button>
                        </div>
                    </div>

                    <div v-if="tag.removeAlert" class="-mt-1.5 mb-3 rounded-lg border p-2">
                        <p class="flex items-center gap-x-1 text-xs text-gray-600">
                            <IconInfoCircle class="text-danger" />

                            <span> حذف برچسب « {{ tag.name }}» باعث میشه این برچسب از روی همه مخاطب‌هایی که بهشون اختصاص داده شده، برداشته بشه. </span>
                        </p>

                        <div class="flex items-center justify-end gap-x-2">
                            <button type="button" class="btn btn-sm btn-outline-danger" @click="cancelRemove(index)">انصراف</button>
                            <button type="button" class="btn btn-sm btn-primary ltr:ml-4 rtl:mr-4" @click="removeTag(tag.id)">تایید</button>
                        </div>
                    </div>
                    <div v-if="tag.editAlert" class="-mt-1.5 mb-3 rounded-lg border p-2">
                        <p class="flex items-center gap-x-1 text-xs text-gray-600">
                            <IconInfoTriangle class="text-warning" />
                            <span> بروزرسانی ویژگی‌های این برچسب باعث میشه این تغییر روی همه مخاطب‌هایی که این برچسب بهشون اختصاص داده شده، اعمال بشه. </span>
                        </p>

                        <div class="flex items-center justify-end gap-x-2">
                            <button type="button" class="btn btn-sm btn-outline-danger" @click="cancelEdit(index)">انصراف</button>
                            <button type="button" class="btn btn-sm btn-primary ltr:ml-4 rtl:mr-4" @click="editTag(tag.id)">تایید</button>
                        </div>
                    </div>
                </template>
            </div>
        </form>
    </BaseModal>
</template>

<style scoped>
    .brown {
        background-color: #964b00;
    }
    .pink {
        background-color: #ff8da1;
    }
    .blue {
        background-color: #0000cd;
    }
    .light_blue {
        background-color: #90d5ff;
    }
    .red {
        background-color: #fa5053;
    }
    .green {
        background-color: #008000;
    }
    .light_green {
        background-color: #89f336;
    }
    .orange {
        background-color: #ff7518;
    }
    .dark_blue {
        background-color: #272757;
    }
    .gray {
        background-color: #6d8196;
    }
    .purple {
        background-color: #873260;
    }
    .light_purple {
        background-color: #9d00ff;
    }
</style>
