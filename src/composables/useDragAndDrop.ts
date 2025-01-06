import { ref, type Ref } from 'vue';
import type { DeedCall } from '../types';

export function useDragAndDrop(calls: Ref<DeedCall[]>, onReorder?: () => void) {
  const draggedItem = ref<number | null>(null);
  const dragTarget = ref<number | null>(null);

  const onDragStart = (index: number, event: DragEvent) => {
    draggedItem.value = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  };

  const onDragOver = (index: number, event: DragEvent) => {
    event.preventDefault();
    dragTarget.value = index;
  };

  const onDrop = (index: number) => {
    if (draggedItem.value === null || draggedItem.value === index) return;
    
    const items = [...calls.value];
    const draggedItemContent = items[draggedItem.value];
    items.splice(draggedItem.value, 1);
    items.splice(index, 0, draggedItemContent);
    calls.value = items;
    
    draggedItem.value = null;
    dragTarget.value = null;

    // Trigger map update callback
    onReorder?.();
  };

  const onDragEnd = () => {
    draggedItem.value = null;
    dragTarget.value = null;
  };

  return {
    draggedItem,
    dragTarget,
    onDragStart,
    onDragOver,
    onDrop,
    onDragEnd
  };
}