<template>
  <component 
    :is="isButton ? 'button' : 'RouterLink'" 
    :to="!isButton ? to : undefined" 
    @click="handleClick"
    :class="[baseTabClasses, isActive ? activeTabClasses : inactiveTabClasses]"
  >
    <Icon 
      :name="rotateIcon ? iconActive : (isActive ? (isDirectory ? iconInactive : iconActive ) : iconInactive)"
      class="w-6 h-6 mb-1 transition-all duration-[10ms]"
    />
    <span class="text-xs font-medium">{{ label }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useNavigationStore } from '~/stores/navigation'

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
  authRoutes?: string[]
}>()

const route = useRoute()
const navigationStore = useNavigationStore()

const baseTabClasses = `
  flex flex-col items-center justify-center rounded-xl flex-1
  transition-all duration-[0ms] ease-out py-2.5
  min-w-0
`

const activeTabClasses = `
  text-white bg-gradient-to-br from-amber-500 to-amber-600
`

const inactiveTabClasses = `
  text-stone-600
`

const isActive = computed(() => {
  if (props.authRoutes?.length) {
    return props.authRoutes.some(path => route.path === path || route.path.startsWith(path + '/'))
  }

  if (props.isDirectory && props.directoryRoutes?.length) {
    return navigationStore.isDirectoryRoute
  }

  if (props.to === '/') return route.path === '/'

  return route.path?.startsWith(props.to || '') ?? false
})

const rotateIcon = computed(() => props.isButton && props.isMenuOpen)

const handleClick = () => {
  if (props.isButton && props.onClick) props.onClick()
}
</script>

<style scoped>
.component {
  /* Fixed height to prevent layout shifts */
  height: 60px;
  min-height: 60px;
}

/* Responsive adjustments for very small screens */
@media (max-width: 360px) {
  .component {
    height: 56px;
    min-height: 56px;
  }
}
</style>