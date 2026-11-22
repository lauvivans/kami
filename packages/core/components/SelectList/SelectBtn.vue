<script setup lang="ts">
import Dropdown from "@core/components/Dropdown.vue";
import OptionList from "@core/components/SelectList/OptionList.vue";
import { ref } from "vue";
import Icon from "@core/@client/components/Icon.vue";
import { Icons } from "@core/enum";

const props = defineProps<{
  options: [string, string][];
  optionSelected: string;
}>();

const optionSelected = ref(props.optionSelected);
const emit = defineEmits(["toSelect"]);

const open = ref(false);
const button = ref<HTMLElement | null>(null);

function optionClicked(option: string) {
  optionSelected.value = option;
  emit("toSelect", option);
  open.value = false;
}
</script>

<template>
  <div>
    <div class="select-btn" ref="button" @click="open = !open">
      <button>{{ props.optionSelected }}</button>
      <Icon :icon="Icons.arrowDown" />
    </div>

    <Dropdown v-model:open="open" :anchor="button" align="right">
      <div class="theme-options">
        <OptionList
          :options="props.options"
          @toSelect="optionClicked"
          :optionSelected="optionSelected"
        ></OptionList>
      </div>
    </Dropdown>
  </div>
</template>

<style lang="scss">
.select-btn {
  @include flex-layout($flex-direction: row);

  align-items: center;
  cursor: pointer;
  padding: 5px 10px;

  &:hover {
    background-color: $gray-4;
    border-radius: 5px;
  }

  > button {
    border: none;
    background-color: transparent;
    font-family: $default;
    font-size: $fs-small;
    padding: 0;
    cursor: pointer;
    color: $black-6;
  }
}
</style>
