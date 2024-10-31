<script setup lang="ts">
import { CSSProperties, ref } from 'vue';
import { useGetIssues } from './composables/useGetIssues';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';

const issues = useGetIssues();

const selectedIssue = ref<UIIssue>();
const dialogVisible = ref<boolean>(false);
const screenshotElementRef = ref<HTMLDivElement | null>(null)
const issueElementRectStyle = ref<CSSProperties>({
  position: 'absolute',
  outline: "2px red solid"
})
const isHoverImage = ref<boolean>(false);

const onRowSelect = () => {
  dialogVisible.value = true;
};

const onDialogHide = () => {
  selectedIssue.value = undefined;
}



const setScreenshotElementRectStyle = async () => {
  const DIALOG_CLASSNAME = 'p-component-overlay-enter'
  const dialogElement = document.getElementsByClassName(DIALOG_CLASSNAME)[0]

  dialogElement.addEventListener("animationend", () => {
    if(!screenshotElementRef.value) return;
    if(!selectedIssue.value) return

    const screenshotElementRect = screenshotElementRef.value.getBoundingClientRect()

    const screenshotRatio = screenshotElementRect.width / selectedIssue.value.screenshotSize.width;

    issueElementRectStyle.value = {
      ...issueElementRectStyle.value,
      top: selectedIssue.value.elementRect.y * screenshotRatio + 'px',
      left: selectedIssue.value.elementRect.x * screenshotRatio + 'px',
      width: selectedIssue.value.elementRect.width * screenshotRatio + 'px',
      height: selectedIssue.value.elementRect.height * screenshotRatio + 'px',
    }
  })
}

</script>

<template>
  <h1>Liste d'issue </h1>
  <DataTable v-model:selection="selectedIssue" :value="issues" selectionMode="single" dataKey="id" :metaKeySelection="false" @rowSelect="onRowSelect" tableStyle="min-width: 50rem">
    <Column field="message" header="Message"></Column>
  </DataTable>

  <Dialog v-model:visible="dialogVisible" modal dismissableMask :header="selectedIssue?.message" :style="{ width: '70vw' }" @hide="onDialogHide" @show="setScreenshotElementRectStyle">
    <div ref="screenshotElementRef" @mouseover="isHoverImage = true" @mouseleave="isHoverImage = false" :style="{ position: 'relative', width: '90%', margin: 'auto', overflow: 'hidden'}" >
      <img :src="selectedIssue?.screenshotUrl" :alt="selectedIssue?.message" :style="{ width: '100%'}">
      <div :style="issueElementRectStyle" :class="{ 'cover-image' : isHoverImage}"></div>
    </div>
  </Dialog>
</template>

<style>
.cover-image { 
  box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 0px 1000000px;
}
</style>