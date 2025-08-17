<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

const route = useRoute();
const isOpen = ref(false);
const openMobileSection = ref(null);

const navItems = [
    {
        href: '/',
        label: 'Home',
        subsections: []
    },
    {
        href: '#',
        label: 'About',
        subsections: [
            {
                href: '/about',
                label: 'About Us',
                description: 'Learn more about our parish',
            },
            {
                href: '/timeline',
                label: 'Timeline',
                description: 'Where we are at as a parish',
            },
        ],
    },
    {
        href: '/articles',
        label: 'Articles',
        subsections: []
    },
    {
        href: '/videos',
        label: 'Videos',
        subsections: []
    },
    {
        href: '/schedule',
        label: 'Schedule',
        subsections: []
    },
    {
        href: '/contact',
        label: 'Contact',
        subsections: []
    },
];

// Function to check if a route is active
const isActiveRoute = (href) => {
    if (href === '/home') {
        return route.path === '/' || route.path === '/home';
    }
    return route.path === href;
};

// Function to check if any subsection is active
const hasActiveSubsection = (subsections) => {
    return subsections.some(subsection => isActiveRoute(subsection.href));
};

const handleMobileSectionToggle = (index) => {
    openMobileSection.value = openMobileSection.value === index ? null : index;
};

// Effect to toggle the menu-open class on the body
onMounted(() => {
    if (isOpen.value) {
        document.body.classList.add('menu-open');
    }
});

watch(isOpen, (newValue) => {
    if (newValue) {
        document.body.classList.add('menu-open');
        document.body.style.overflow = 'hidden';
    } else {
        document.body.classList.remove('menu-open');
        document.body.style.overflow = '';
        openMobileSection.value = null;
    }
});

onUnmounted(() => {
    document.body.classList.remove('menu-open');
});
</script>

<template>
    <!-- Mobile background overlay -->
    <div v-if="isOpen" 
         class="fixed inset-0 bg-black/15 backdrop-blur-xs z-40 lg:hidden transition-all duration-1000"
         @click="isOpen = false">
    </div>

    <header
        class="sticky top-0 z-50 w-full border-b border-stone-200/30 bg-gradient-to-r from-slate-50 to-stone-50 backdrop-blur-sm shadow-sm">
        <div class="px-4 flex h-20 items-center">
            <!-- Logo and title section -->
            <div class="flex items-center flex-shrink-0">
                <RouterLink to="/" class="flex justify-center">
                    <NuxtImg 
                        src="/logo.webp" 
                        class="h-[4.25rem] pr-2 sm:pr-4 object-contain self-center"
                        alt="Nativity of the Mother of God Logo"
                        preset="seo"
                        sizes="sm:48px md:68px"
                        
                        loading="eager"
                    />
                    <div class="flex flex-col justify-center">
                        <span
                            class="text-base sm:text-lg md:text-2xl font-bold tracking-tight line-clamp-1 text-stone-800">
                            Nativity of the Mother of God
                        </span>
                        <span class="text-xs md:text-sm text-stone-600 line-clamp-1">
                            Old Rite Orthodox Church in Woodburn, OR
                        </span>
                    </div>
                </RouterLink>
            </div>

            <!-- Spacer to push nav to the right -->
            <div class="flex-grow"></div>

            <!-- Desktop Nav -->
            <nav class="hidden lg:flex items-center space-x-8">
                <div v-for="item in navItems" :key="item.label" class="relative group">
                    <template v-if="item.subsections.length > 0">
                        <div :class="[
                            'flex gap-1 items-center cursor-pointer text-xl transition-colors group-hover:text-amber-600 font-medium',
                            hasActiveSubsection(item.subsections) ? 'text-amber-600' : 'text-stone-700'
                        ]">
                            <span>{{ item.label }}</span>
                            <Icon name="material-symbols:keyboard-arrow-down" />
                        </div>
                        <div
                            class="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden z-50 border border-stone-200/50">
                            <div class="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
                            <div class="p-1">
                                <RouterLink v-for="subsection in item.subsections" :key="subsection.label"
                                    :to="subsection.href" :class="[
                                        'block relative p-4 hover:bg-amber-50/70 transition-colors rounded-md m-1 group/subsection',
                                        isActiveRoute(subsection.href) ? 'bg-amber-50/70' : ''
                                    ]">
                                    <div :class="[
                                        'absolute left-0 top-0 w-0.5 bg-amber-500 transition-all duration-300 ease-out rounded-l-md',
                                        isActiveRoute(subsection.href) ? 'h-full' : 'h-0 group-hover/subsection:h-full'
                                    ]">
                                    </div>
                                    <div :class="[
                                        'text-base font-medium mb-1',
                                        isActiveRoute(subsection.href) ? 'text-amber-600' : 'text-stone-800'
                                    ]">
                                        {{ subsection.label }}
                                    </div>
                                    <div class="text-sm text-stone-600">
                                        {{ subsection.description }}
                                    </div>
                                </RouterLink>
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <RouterLink :to="item.href" :class="[
                            'text-xl transition-colors hover:bg-transparent hover:text-amber-600 p-0 h-auto font-medium',
                            isActiveRoute(item.href) ? 'text-amber-600' : 'text-stone-700'
                        ]">
                            {{ item.label }}
                        </RouterLink>
                    </template>
                </div>
                <!-- Donate button -->
                <NuxtLink to="https://donate.nativityofthemotherofgod.com/b/14A6oJakr1TD3Zs7DBeQM00"
                    class="text-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 h-auto rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
                    Donate
                </NuxtLink>
            </nav>

            <!-- Mobile Toggle -->
            <button class="lg:hidden ml-4 p-2 text-stone-700 relative w-10 h-10 flex items-center justify-center"
                @click="isOpen = !isOpen">
                <div class="w-6 h-6 relative flex flex-col justify-center items-center">
                    <!-- Top line -->
                    <span :class="[
                        'block h-0.5 w-6 bg-stone-700 transform transition-all duration-300 ease-in-out',
                        isOpen ? 'rotate-45 translate-y-0.5' : '-translate-y-1.5'
                    ]"></span>
                    <!-- Middle line -->
                    <span :class="[
                        'block h-0.5 w-6 bg-stone-700 transform transition-all duration-300 ease-in-out',
                        isOpen ? 'opacity-0' : 'opacity-100'
                    ]"></span>
                    <!-- Bottom line -->
                    <span :class="[
                        'block h-0.5 w-6 bg-stone-700 transform transition-all duration-300 ease-in-out',
                        isOpen ? '-rotate-45 -translate-y-0.5' : 'translate-y-1.5'
                    ]"></span>
                </div>
            </button>
        </div>

        <!-- Mobile Nav -->
        <div :class="[
            'lg:hidden w-full border-t border-stone-200/30 bg-gradient-to-r from-slate-50 to-stone-50 backdrop-blur-sm overflow-hidden transition-all duration-200 ease-out shadow-lg',
            isOpen ? 'max-h-[calc(100vh-5rem)]' : 'max-h-0',
        ]">
            <nav class="py-2 px-4 flex flex-col space-y-1 overflow-y-auto max-h-[calc(100vh-5rem)]">
                <template v-for="(item, index) in navItems" :key="item.label">
                    <div class="border-b border-stone-200/40 pb-1">
                        <UButton v-if="item.subsections.length > 0" :class="[
                            'w-full text-left text-xl font-medium py-3 px-3 rounded-lg transition-all duration-200 flex items-center justify-between group',
                            hasActiveSubsection(item.subsections) ? 'text-amber-600' : 'text-stone-800'
                        ]" @click="handleMobileSectionToggle(index)">
                            <span :class="[
                                'transition-colors',
                                hasActiveSubsection(item.subsections) ? 'text-amber-600' : 'group-hover:text-amber-600'
                            ]">{{ item.label }}</span>
                            <Icon
                                :name="openMobileSection === index ? 'heroicons:chevron-up-20-solid' : 'heroicons:chevron-down-20-solid'"
                                size="24" class="w-7 h-7 text-amber-500 transition-transform duration-200" />
                        </UButton>
                        <RouterLink v-else :to="item.href" :class="[
                            'w-full text-left text-xl font-medium py-3 px-3 rounded-lg hover:text-amber-600 transition-all duration-200 block',
                            isActiveRoute(item.href) ? 'text-amber-600' : 'text-stone-800'
                        ]" @click="isOpen = false">
                            {{ item.label }}
                        </RouterLink>

                        <!-- Animated accordion subsections -->
                        <div :class="[
                            'ml-2 flex flex-col overflow-hidden transition-all duration-200 ease-in-out',
                            openMobileSection === index ? 'max-h-80' : 'max-h-0',
                        ]">
                            <div v-for="subsection in item.subsections" :key="subsection.label"
                                class="relative flex items-start transition-all duration-200 ease-in-out mb-4">
                                <div :class="[
                                    'absolute left-0 top-0 w-0.5 bg-gradient-to-b from-amber-400 to-amber-600 transition-all duration-300 ease-out rounded-full',
                                    isActiveRoute(subsection.href) ? 'h-full' : (openMobileSection === index ? 'h-full' : 'h-0'),
                                ]" />
                                <RouterLink :to="subsection.href" :class="[
                                    'flex-1 ml-3 px-3 py-1.5 rounded-lg transition-all duration-200 group/sub',
                                    isActiveRoute(subsection.href) ? '' : ''
                                ]" @click="isOpen = false; openMobileSection = null">
                                    <div class="flex flex-col">
                                        <span :class="[
                                            'text-base font-medium transition-colors',
                                            isActiveRoute(subsection.href) ? 'text-amber-600' : 'text-stone-800 group-hover/sub:text-amber-600'
                                        ]">
                                            {{ subsection.label }}
                                        </span>
                                        <span class="text-sm text-stone-600 mt-0.5 leading-relaxed">
                                            {{ subsection.description }}
                                        </span>
                                    </div>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </template>

                <!-- Donate button -->
                <div class="py-3 flex-shrink-0">
                    <NuxtLink to="https://donate.nativityofthemotherofgod.com/b/14A6oJakr1TD3Zs7DBeQM00"
                        class="w-full text-center text-lg font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 block"
                        @click="isOpen = false">
                        Donate
                    </NuxtLink>
                </div>
            </nav>
        </div>
    </header>
</template>

<style scoped>
/* Tailwind CSS is already included via classes, so no additional CSS is needed */
</style>
