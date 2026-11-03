<template>
  <div class="fixed bottom-0 left-0 right-0 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-[#2B3B46] via-[#2B3B46]/85 to-transparent backdrop-blur-md z-50 pointer-events-auto">
    <div class="max-w-md mx-auto">
      <button 
        @click="$emit('submit')"
        :disabled="loading || disabled"
        class="w-full py-4 px-6 rounded-full bg-white text-[#1E293B] font-semibold text-base shadow-[0_10px_25px_rgba(0,0,0,0.3)] hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        <span v-if="!loading" class="flex items-center gap-2">
          <slot>Book Now</slot>
        </span>
        <span v-else class="flex items-center gap-2 animate-pulse font-medium">
          <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-[#1E293B]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Apartando mesa...
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean
  disabled?: boolean
}>()

defineEmits<{
  (e: 'submit'): void
}>()
</script>
