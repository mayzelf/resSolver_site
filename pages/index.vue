<template>
<main>
    <div role="form">
    <div v-if="!loading" class="flex flex-col items-center justify-center min-h-screen py-2 dark:bg-gray-800 dark:text-white" :class="{ dark: darkMode }">
        <div class="flex items-center justify-between w-full max-w-xs px-8 mb-4">
            <h1 class="text-2xl">Resolution Proof Solver</h1>
            <div>
                <div @click="toggleDarkMode"
                    class="cursor-pointer w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 duration-300 ease-in-out"
                    :class="{ 'bg-blue-600': darkMode }">
                    <div class="dark:bg-gray-800 bg-white w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out flex items-center justify-center"
                        :class="{ 'translate-x-5': darkMode }">
                        <font-awesome :icon="darkMode ? ['far', 'moon'] : ['far', 'sun']" class="text-xs" />
                    </div>
                </div>
            </div>
        </div>
        <div class="w-full max-w-xs">
            <form @submit.prevent="submitForm" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 dark:bg-gray-700">
                <div class="mb-4">
                    <label class="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-300" for="user_input">
                        Enter a string:
                    </label>
                    <input
                        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-600 dark:text-white"
                        id="user_input" type="text" v-model="userInput" placeholder="(a or b) and (a or !b) and (!a)">
                </div>
                <div class="flex items-center justify-between">
                    <button
                        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline dark:bg-blue-600 dark:hover:bg-blue-500"
                        type="submit">
                        Solve
                    </button>
                </div>
            </form>
        
            <p class="text-center text-gray-500 text-xs dark:text-gray-400">
                mayzelf.xyz - Resolution Proof Solver
            </p>
        </div>
        <div v-if="result" class="mt-4">
            <Graph :result="result" />
            <div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 dark:bg-gray-700" hidden>
                <p class="text-gray-700 text-sm font-bold mb-2 dark:text-gray-300">Result:</p>
                <p class="text-gray-700 text-base dark:text-white">{{ result }}</p>
            </div>
        </div>
    </div>
</div>
</main>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue';
import { solve } from './solver';
import Graph from '~/components/Graph.vue';

useHead({
    title: 'Resolution Proof Solver',
    htmlAttrs: {
        lang: 'en',
    },
    meta: [
        { name: 'description', content: 'A web application for solving logical expressions and visualizing the solution as a graph.' },
        { property: 'og:title', content: 'Resolution Proof Solver' },
        { property: 'og:description', content: 'A web application for solving logical expressions and visualizing the solution as a graph.' },
        { property: 'og:url', content: 'http://resolutionsolver.mayzelf.xyz' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: 'mayzelf.png' },
        { name: 'twitter:title', content: 'Resolution Proof Solver' },
        { name: 'twitter:description', content: 'A web application for solving logical expressions and visualizing the solution as a graph.' },
        { name: 'twitter:card', content: 'mayzelf.png' },
    ]
})


let loading = ref(true);
let darkMode: Ref<boolean>;
const userInput = ref('');
const result = ref<string[]>([]);

if (process.client) {
  darkMode = ref(false);
}

const submitForm = (): void => {
    let solveResult = solve(userInput.value);

    if (typeof solveResult === 'string') {
        result.value = [solveResult];
    } else {
        result.value = solveResult;
    }
};

const toggleDarkMode = () => {
  if (process.client) {
    darkMode.value = !darkMode.value;
    localStorage.setItem('darkMode', darkMode.value.toString());
    if (darkMode.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};


onBeforeMount(() => {
  if (process.client) {
    darkMode.value = localStorage.getItem("darkMode")
      ? localStorage.getItem("darkMode") === "true"
      : false;
    loading.value = false;
  }
});

</script>
