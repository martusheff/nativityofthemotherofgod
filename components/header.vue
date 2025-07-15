<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { RouterLink } from 'vue-router';

const isOpen = ref(false);
const openMobileSection = ref(null);

const navItems = [
    // {
    //     href: '#',
    //     label: 'Our Parish',
    //     subsections: [
    //         {
    //             href: '/schedule',
    //             label: 'Service Schedule',
    //             description: 'Up to date times for our services',
    //         },
    //         {
    //             href: '/clergy',
    //             label: 'Clergy',
    //             description: 'Get familiar with our Clergy',
    //         },
    //         {
    //             href: '/singing',
    //             label: 'Singing',
    //             description: 'The Znamenny chant, in english',
    //         },
    //         {
    //             href: '/visit',
    //             label: 'Visit',
    //             description: 'Curious? Come and visit!',
    //         },
    //     ],
    // },
    // {
    //     href: '#',
    //     label: 'Orthodoxy',
    //     subsections: [
    //         {
    //             href: '/orthodoxy',
    //             label: 'What is Orthodoxy?',
    //             description: 'Learn more about Orthodoxy',
    //         },
    //         {
    //             href: '/old-rite',
    //             label: 'The Old-Rite',
    //             description: 'Learn about the Old Rite Faith',
    //         },
    //         {
    //             href: '/prayers',
    //             label: 'Prayers',
    //             description: 'Daily Orthodox Devotions',
    //         },
    //         {
    //             href: '/faq',
    //             label: 'FAQs',
    //             description: 'Answers to Common Questions',
    //         },
    //     ],
    // },
    // {
    //     href: '#',
    //     label: 'Media',
    //     subsections: [
    //         {
    //             href: '/gallery',
    //             label: 'Gallery',
    //             description: 'Photos and videos from parish life',
    //         },
    //         {
    //             href: '/choir',
    //             label: 'Choir',
    //             description: 'The beautiful chants of our choir',
    //         },
    //     ],
    // },
            {
        href: '/schedule',
        label: 'Service Schedule',
        subsections: []
    },
        {
        href: '/timeline',
        label: 'Timeline',
        subsections: []
    },
    {
        href: '/articles',
        label: 'Articles',
        subsections: []
    },
        {
        href: '/contact',
        label: 'Contact',
        subsections: []
    },
];

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
        openMobileSection.value = null; // Close all subsections when menu closes
    }
});

onUnmounted(() => {
    document.body.classList.remove('menu-open');
});
</script>

<template>
    <header class="sticky top-0 z-50 w-full border-b border-stone-200/30 bg-gradient-to-r from-slate-50 to-stone-50 backdrop-blur-sm shadow-sm">
        <div class="px-4 flex h-20 items-center">
            <!-- Logo and title section -->
            <div class="flex items-center flex-shrink-0">
                <img src="/logo2.png" class="h-[4.25rem] pr-2 sm:pr-4 object-contain self-center" alt="Logo" />
                <RouterLink to="/" class="flex flex-col justify-center">
                    <span class="text-base sm:text-lg md:text-2xl font-bold tracking-tight line-clamp-1 text-stone-800">
                        Nativity of the Mother of God
                    </span>
                    <span class="text-xs md:text-sm text-stone-600 line-clamp-1">
                        Old Rite Orthodox Church in Woodburn, OR
                    </span>
                </RouterLink>
            </div>

            <!-- Spacer to push nav to the right -->
            <div class="flex-grow"></div>

            <!-- Desktop Nav -->
            <nav class="hidden lg:flex items-center space-x-8">
                <div v-for="item in navItems" :key="item.label" class="relative group">
                    <template v-if="item.subsections.length > 0">
                        <div
                            class="flex gap-1 items-center cursor-pointer text-xl transition-colors group-hover:text-amber-600 text-stone-700 font-medium">
                            <span>{{ item.label }}</span>
                            <Icon name="material-symbols:keyboard-arrow-down" />
                        </div>
                        <div
                            class="absolute left-1/2 -translate-x-1/2 top-full mt-4 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 bg-white/95 backdrop-blur-sm shadow-lg rounded-lg overflow-hidden z-50 border border-stone-200/50">
                            <div class="absolute -top-4 left-0 w-full h-4 bg-transparent"></div>
                            <div class="p-1">
                                <RouterLink v-for="subsection in item.subsections" :key="subsection.label"
                                    :to="subsection.href"
                                    class="block relative p-4 hover:bg-amber-50/70 transition-colors rounded-md m-1 group/subsection">
                                    <div
                                        class="absolute left-0 top-0 w-0.5 h-0 bg-amber-500 group-hover/subsection:h-full transition-all duration-300 ease-out rounded-l-md">
                                    </div>
                                    <div class="text-base font-medium mb-1 text-stone-800">
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
                        <RouterLink :to="item.href"
                            class="text-xl transition-colors hover:bg-transparent hover:text-amber-600 p-0 h-auto text-stone-700 font-medium">
                            {{ item.label }}
                        </RouterLink>
                    </template>
                </div>
                <!-- Donate button -->
                <RouterLink to="/donate"
                    class="text-xl transition-all duration-300 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-3 h-auto rounded-full shadow-md hover:shadow-lg transform hover:-translate-y-0.5 font-medium">
                    Donate
                </RouterLink>
            </nav>

            <!-- Mobile Toggle -->
            <button
                class="lg:hidden ml-4 p-2 text-stone-700 relative w-10 h-10 flex items-center justify-center"
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
                    <div class="border-b border-stone-200/20 pb-2 last:border-b-0">
                        <UButton
                            v-if="item.subsections.length > 0"
                            class="w-full text-left text-lg font-medium text-stone-800 py-3 px-3 rounded-lg hover:bg-white/60 transition-all duration-200 flex items-center justify-between group"
                            @click="handleMobileSectionToggle(index)">
                            <span class="group-hover:text-amber-600 transition-colors">{{ item.label }}</span>
                            <Icon 
                                :name="openMobileSection === index ? 'heroicons:chevron-up-20-solid' : 'heroicons:chevron-down-20-solid'"
                                size="24" class="w-7 h-7 text-amber-500 transition-transform duration-200"
                            />
                        </UButton>
                        <RouterLink 
                            v-else 
                            :to="item.href" 
                            class="w-full text-left text-xl font-medium text-stone-800 py-3 px-3 rounded-lg hover:bg-white/60 hover:text-amber-600 transition-all duration-200 block"
                            @click="isOpen = false">
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
                                    openMobileSection === index ? 'h-full' : 'h-0',
                                ]" />
                                <RouterLink :to="subsection.href"
                                    class="flex-1 ml-3 px-3 py-1.5 rounded-lg hover:bg-white/60 transition-all duration-200 group/sub"
                                    @click="isOpen = false; openMobileSection = null">
                                    <div class="flex flex-col">
                                        <span class="text-base font-medium text-stone-800 group-hover/sub:text-amber-600 transition-colors">
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
                    <RouterLink to="/donate"
                        class="w-full text-center text-lg font-medium bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white py-3 px-6 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 block"
                        @click="isOpen = false">
                        Donate
                    </RouterLink>
                </div>
            </nav>
        </div>
    </header>
</template>

<style scoped>
/* Tailwind CSS is already included via classes, so no additional CSS is needed */
</style>