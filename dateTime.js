import { defineStore } from 'pinia'
import { useUtilStore } from '@/store/utils'
import axios from 'axios'
import { useToast } from 'vue-toastification'

const toast = useToast()

export const useDateTimeStore = defineStore({
  id: 'dateTimeStore',
  state: () => ({
    date: {
      date: '',
      time: '',
      tz: 5,
    },
    gpsSync: {
      delay: 0,
      jitter: 0,
      offset: 0,
    }
  }),
  actions: {
    //=========================== GET ===========================
    async getDateTime() {
      const { data } = await axios.get('/gettime')
      this.date = data.data
    },
    async getGpsSync() {
      const { data } = await axios.get('/api/gps_sync')
      this.gpsSync = data.data
    },
    //=========================== POST ===========================
    async setTimeZone(tz) {
      const formData = new FormData()
      formData.append('tz', tz)
      try {
        await axios.post('/api/settimezone', formData)
        toast.success('Часовой пояс обновлён')
      } catch (e) {
        const utilStore = useUtilStore()
        utilStore.axiosErrorHandler(e)
      }
    },
  }
})
