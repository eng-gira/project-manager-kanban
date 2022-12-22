import { onMounted, ref } from "vue"

export function useMedia(query, initialState = false) {
    const state = ref(initialState)
    
    onMounted(()=>{
      const mql = window.matchMedia(query)
      state.value = Boolean(mql.matches)
      function onChange() {
        state.value = Boolean(mql.matches)
      }
      mql.addListener(onChange)
      
      // mql.removeListener(onChange)
    })
    
    return state
  }