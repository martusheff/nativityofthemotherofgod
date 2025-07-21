<template>
  <component
    :is="isButton ? 'button' : 'RouterLink'"
    :to="!isButton ? to : undefined"
    @click="handleClick"
    :class="[baseTabClasses, isActive ? activeTabClasses : inactiveTabClasses]"
  >
    <Icon
      :name="isActive ? iconActive : iconInactive"
      class="w-6 h-6 mb-1 transition-transform duration-300"
      :class="rotateIcon ? 'rotate-180' : ''"
    />
    <span class="text-xs font-medium">{{ label }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Props
const props = defineProps<{
  to?: string
  label: string
  iconActive: string
  iconInactive: string
  isButton?: boolean
  onClick?: () => void
  isMenuOpen?: boolean
  isDirectory?: boolean
  directoryRoutes?: string[]
}>()

const route = useRoute()

// 👇 Split transition: color + bg
const baseTabClasses = `flex flex-col items-center justify-center py-3 px-3 rounded-xl flex-1`
const activeTabClasses = 'text-white bg-gradient-to-br from-amber-500 to-amber-600'
const inactiveTabClasses = 'text-stone-600'

// ✅ Active logic for directory OR normal
const isActive = computed(() => {
  if (props.isDirectory && props.directoryRoutes?.length) {
    return props.directoryRoutes.some(path => route.path.startsWith(path))
  }
  if (props.to === '/') return route.path === '/'
  return route.path?.startsWith(props.to || '') ?? false
})

// Only rotate if menu open + this is the button
const rotateIcon = computed(() => props.isButton && props.isMenuOpen)

// Handle click
const handleClick = () => {
  if (props.isButton && props.onClick) props.onClick()
}
</script>
