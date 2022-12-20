import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "./assets/main.css";


import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdEdit, IoRemoveCircleSharp, IoAddOutline} from "oh-vue-icons/icons";

addIcons(MdEdit, IoRemoveCircleSharp, IoAddOutline);


createApp(App).use(store).use(router).component("v-icon", OhVueIcon).mount('#app')
