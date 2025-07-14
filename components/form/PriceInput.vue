<script setup lang="ts">
import { computed } from "vue";
import Num2persian from "num2persian";

export interface Props {
  type?: string;
  sm?: boolean;
  lg?: boolean;
  error?: boolean;
  readOnly?: boolean;
  value?: string | number;
  modelValue: number | null;
  placeholder?: string;
  hint?: string | string[];
  rial?: boolean;
  letter?: boolean;
}

// const { type, sm, lg, error, readOnly, value, modelValue, placeholder, hint } =
const props = withDefaults(defineProps<Props>(), {
  type: "number",
});

const emit = defineEmits<{
  (e: "update:modelValue", id: any): void;
  (e: "clearError"): void;
}>();

const input = ref();
const isFocus = ref(false);

const inputFocus = () => {
  input.value.focus();
  isFocus.value = true;
};

const blurInput = () => {
  isFocus.value = false;
};

const errorClass = computed<string>(() => {
  return props.error
    ? "border-danger bg-danger-light"
    : "  focus:border-primary   ";
});

const sizeClass = computed<string>(() => {
  return props.sm ? "h-10 md:h-14 " : props.lg ? "h-14" : "h-10 md:h-10 ";
});

const handleInput = (e: any) => {
  emit("clearError");
  emit("update:modelValue", (e.target as HTMLInputElement).value);
};
</script>
<template>
  <div class="relative">
    <input
      dir="ltr"
      ref="input"
      :readonly="readOnly"
      :placeholder="placeholder"
      :type="type"
      class="peer w-full rounded-lg border px-3 py-2 text-sm text-transparent outline-none placeholder:text-right"
      :class="[sizeClass, errorClass, readOnly && 'bg-gray-50']"
      :value="modelValue"
      @input="handleInput($event)"
      @blur="blurInput"
    />
    <!-- @input="
        emit('update:modelValue', ($event.target as HTMLInputElement).value)
      " -->

    <div class="flex items-center justify-between">
      <p class="text-right text-xs leading-5 text-danger" v-if="error">
        <span v-for="error in hint">{{ error }} </span>
      </p>

      <div class="text-right text-xs leading-5 text-gray-500" v-else>
        <p v-if="modelValue && letter">
          {{ Num2persian(modelValue) }}
        </p>
        <p>
          {{ hint }}
        </p>
      </div>
      <p
        class="text-right text-xs leading-5"
        :class="error ? 'text-danger' : 'text-gray-500'"
      >
        به {{ rial ? "ریال" : "تومان" }}
      </p>
    </div>

    <p
      dir="ltr"
      class="absolute top-0 flex h-10 w-full items-center px-3 text-sm"
      :class="isFocus && 'price'"
      @click="inputFocus"
    >
      {{ modelValue && new Intl.NumberFormat().format(modelValue) }}
    </p>
  </div>
</template>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type="number"] {
  -moz-appearance: textfield;
}

.price:after {
  content: "";
  width: 1px;
  height: 16px;
  background: #1e1e1e;
  opacity: 0;
  display: inline-block;
  animation: blink 0.5s linear infinite alternate;
  position: absolute;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
