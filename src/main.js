import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import "./assets/main.css";

import { OhVueIcon, addIcons } from "oh-vue-icons";
import { MdEdit, IoRemoveCircleSharp, IoAddOutline, CoHamburgerMenu, IoChevronBack, IoCloseOutline} from "oh-vue-icons/icons"

import 'nprogress/nprogress.css'



addIcons(MdEdit, IoRemoveCircleSharp, IoAddOutline, CoHamburgerMenu, IoChevronBack, IoCloseOutline)

createApp(App).use(store).use(router).component("v-icon", OhVueIcon).mount('#app')
