import { defineStore } from 'pinia'


export const useCommonStore = defineStore('commonStore', {
  state: () => ({
    isLoading: false

  }),
  getters: {
    getLoading: state => state.isLoading,
  },
  actions: {
     setLoading(status: boolean) {
      console.log('setLoading', status)
      this.isLoading = status
    },
    init() { 
      this.setLoading(false)
    }
  },
  persist: true
})
