<template>
  <component :is="isButton ? 'button' : 'RouterLink'" :to="!isButton ? to : undefined" @click="handleClick"
    :class="[baseTabClasses, isActive ? activeTabClasses : inactiveTabClasses]">
    <Icon :name="isActive ? iconActive : iconInactive" class="w-6 h-6 mb-1 transition-transform duration-300"
      :class="rotateIcon ? 'rotate-180' : ''" />
    <span class="text-xs font-medium">{{ label }}</span>
  </component>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

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

const baseTabClasses = `h-15 aspect-square flex flex-col items-center justify-center rounded-xl flex-1`
const activeTabClasses = 'aspect-square text-white bg-gradient-to-br from-amber-500 to-amber-600'
const inactiveTabClasses = 'aspect-square text-stone-600'

const isActive = computed(() => {
  if (props.authRoutes?.length) {
    return props.authRoutes.some(path => route.path === path || route.path.startsWith(path + '/'))
  }

  if (props.isDirectory && props.directoryRoutes?.length) {
    return props.directoryRoutes.some(path => route.path.startsWith(path))
  }

  if (props.to === '/') return route.path === '/'

  return route.path?.startsWith(props.to || '') ?? false
})

const rotateIcon = computed(() => props.isButton && props.isMenuOpen)

const handleClick = () => {
  if (props.isButton && props.onClick) props.onClick()
}
</script>