<script setup lang="ts">
import { ref, nextTick } from 'vue';
import type { DeedCall } from '../types';
import { createNewCall } from '../utils/callHelpers';

const emit = defineEmits<{
  (e: 'addCall', call: DeedCall): void;
}>();

const mode = ref<'pro' | 'novice'>('pro');
const currentCall = ref<DeedCall>(createNewCall());
const bearingInput = ref<HTMLInputElement | null>(null);
const distanceInput = ref<HTMLInputElement | null>(null);

const updateNoviceBearing = () => {
  const nb = currentCall.value.noviceBearing;
  
  if (!nb.degrees || Number(nb.degrees) < 0 || Number(nb.degrees) > 90) return;
  if (nb.minutes && (Number(nb.minutes) < 0 || Number(nb.minutes) > 59)) return;
  if (nb.seconds && (Number(nb.seconds) < 0 || Number(nb.seconds) > 59)) return;

  let quadrant = 1;
  if (nb.direction1 === 'N' && nb.direction2 === 'E') quadrant = 1;
  if (nb.direction1 === 'S' && nb.direction2 === 'E') quadrant = 2;
  if (nb.direction1 === 'S' && nb.direction2 === 'W') quadrant = 3;
  if (nb.direction1 === 'N' && nb.direction2 === 'W') quadrant = 4;

  const formattedMinutes = (nb.minutes || '0').toString().padStart(2, '0');
  const formattedSeconds = (nb.seconds || '0').toString().padStart(2, '0');
  
  currentCall.value.bearing = `${quadrant}${nb.degrees}.${formattedMinutes}${formattedSeconds}`;
};

const handleBearingKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    distanceInput.value?.focus();
  }
};

const handleDistanceKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    addCall();
  }
};

const addCall = () => {
  if (!isValidCall()) return;
  
  emit('addCall', { ...currentCall.value });
  currentCall.value = createNewCall();
  nextTick(() => {
    bearingInput.value?.focus();
  });
};

const isValidCall = () => {
  if (currentCall.value.type === 'line') {
    return currentCall.value.bearing && currentCall.value.distance > 0;
  } else {
    return currentCall.value.curve.radius > 0 && currentCall.value.curve.length > 0;
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm mb-6">
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold">Add New Call</h2>
    </div>
    
    <div class="p-4">
      <!-- Mode and Type Toggle Row -->
      <div class="flex justify-between mb-4">
        <!-- Type Toggle - Left aligned -->
        <div class="flex items-center bg-gray-100 p-1 rounded-lg">
          <input type="radio" id="line-type" v-model="currentCall.type" value="line" class="hidden" />
          <label for="line-type"
                 class="cursor-pointer px-3 py-1 text-sm rounded-md"
                 :class="{ 'bg-white shadow': currentCall.type === 'line' }">
            Line
          </label>

          <input type="radio" id="curve-type" v-model="currentCall.type" value="curve" class="hidden" />
          <label for="curve-type"
                 class="cursor-pointer px-3 py-1 text-sm rounded-md"
                 :class="{ 'bg-white shadow': currentCall.type === 'curve' }">
            Curve
          </label>
        </div>

        <!-- Mode Toggle - Right aligned -->
        <div class="flex items-center bg-gray-100 p-1 rounded-lg">
          <input type="radio" id="pro-mode" v-model="mode" value="pro" class="hidden" />
          <label for="pro-mode" 
                 class="cursor-pointer px-3 py-1 text-sm rounded-md"
                 :class="{ 'bg-blue-500 text-white': mode === 'pro' }">
            Pro
          </label>

          <input type="radio" id="novice-mode" v-model="mode" value="novice" class="hidden" />
          <label for="novice-mode"
                 class="cursor-pointer px-3 py-1 text-sm rounded-md"
                 :class="{ 'bg-blue-500 text-white': mode === 'novice' }">
            Novice
          </label>
        </div>
      </div>

      <!-- Input Fields -->
      <div class="flex items-center space-x-2">
        <template v-if="currentCall.type === 'line'">
          <!-- Bearing Input -->
          <template v-if="mode === 'pro'">
            <input type="text"
                   ref="bearingInput"
                   v-model="currentCall.bearing"
                   placeholder="Bearing"
                   @keydown="handleBearingKeyDown"
                   class="w-32 px-2 py-1 border border-gray-300 rounded text-sm" />
          </template>
          
          <template v-else>
            <div class="flex space-x-1">
              <select v-model="currentCall.noviceBearing.direction1"
                      class="w-10 px-1 py-1 border border-gray-300 rounded text-sm"
                      @change="updateNoviceBearing">
                <option value="N">N</option>
                <option value="S">S</option>
              </select>
              
              <input type="number"
                     v-model="currentCall.noviceBearing.degrees"
                     placeholder="DD"
                     min="0"
                     max="90"
                     class="w-12 px-1 py-1 border border-gray-300 rounded text-sm"
                     @input="updateNoviceBearing" />
              
              <input type="number"
                     v-model="currentCall.noviceBearing.minutes"
                     placeholder="MM"
                     min="0"
                     max="59"
                     class="w-12 px-1 py-1 border border-gray-300 rounded text-sm"
                     @input="updateNoviceBearing" />
              
              <input type="number"
                     v-model="currentCall.noviceBearing.seconds"
                     placeholder="SS"
                     min="0"
                     max="59"
                     class="w-12 px-1 py-1 border border-gray-300 rounded text-sm"
                     @input="updateNoviceBearing" />
              
              <select v-model="currentCall.noviceBearing.direction2"
                      class="w-10 px-1 py-1 border border-gray-300 rounded text-sm"
                      @change="updateNoviceBearing">
                <option value="E">E</option>
                <option value="W">W</option>
              </select>
            </div>
          </template>

          <!-- Distance Input -->
          <input type="number"
                 ref="distanceInput"
                 v-model.number="currentCall.distance"
                 placeholder="Distance"
                 min="0"
                 @keydown="handleDistanceKeyDown"
                 class="w-24 px-2 py-1 border border-gray-300 rounded text-sm" />
        </template>

        <template v-else>
          <!-- Curve Inputs -->
          <input type="number"
                 v-model.number="currentCall.curve.radius"
                 placeholder="Radius"
                 class="w-24 px-2 py-1 border border-gray-300 rounded text-sm" />

          <select v-model="currentCall.curve.lengthType"
                  class="w-24 px-2 py-1 border border-gray-300 rounded text-sm">
            <option value="arc">Arc</option>
            <option value="chord">Chord</option>
          </select>

          <input type="number"
                 v-model.number="currentCall.curve.length"
                 :placeholder="currentCall.curve.lengthType === 'arc' ? 'Arc Length' : 'Chord Length'"
                 class="w-24 px-2 py-1 border border-gray-300 rounded text-sm" />

          <select v-model="currentCall.curve.direction"
                  class="w-24 px-2 py-1 border border-gray-300 rounded text-sm">
            <option value="clockwise">CW</option>
            <option value="counterclockwise">CCW</option>
          </select>
        </template>

        <!-- Unit Selection -->
        <select v-model="currentCall.unit"
                class="w-20 px-2 py-1 border border-gray-300 rounded text-sm">
          <option value="feet">Feet</option>
          <option value="meters">M</option>
          <option value="chains">Ch</option>
          <option value="rods">Rods</option>
        </select>

        <!-- Add Button -->
        <button @click="addCall"
                class="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors">
          Add
        </button>
      </div>
    </div>
  </div>
</template>