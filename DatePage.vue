<template>
  <v-container fluid>
    <v-row class="flex-column" no-gutters>
      <v-col lg="6" md="8" class="mb-4">
        <v-card>
          <v-card-title>
            Дата/время
            <SaveButton @click="setTimeZone"/>
          </v-card-title>
          <v-card-text>
            <v-row class="flex-column flex-sm-row">
              <v-col>
                <v-text-field readonly v-model="currentDateTime"/>
              </v-col>
              <v-col sm="5">
                <v-select :items="timeZonesRange" v-model="timeZone"/>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col lg="6" md="8">
        <v-card>
          <v-card-title>
            Синхронизация GPS
            <RefreshButton @click="dateStore.getGpsSync"/>
          </v-card-title>
          <v-card-text>
            <v-table density="compact">
              <thead>
              <tr>
                <th>Источник синхронизации</th>
                <th>Отклонение, мс</th>
                <th>Нестабильность, мс</th>
                <th>Посл. синхр, с</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td>{{ dateStore.gpsSync.source }}</td>
                <td>{{ parseFloat(dateStore.gpsSync.offset).toFixed(4) }}</td>
                <td>{{ parseFloat(dateStore.gpsSync.jitter).toFixed(4) }}</td>
                <td>{{ dateStore.gpsSync.when }}</td>
              </tr>
              </tbody>
            </v-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
//========== IMPORTS ==========
import { ref, onMounted, computed } from 'vue'
import { onBeforeRouteLeave } from 'vue-router'
import { useDateTimeStore } from '@/store/dateTime'
import { range } from 'lodash'
import SaveButton from '@/components/common/buttons/SaveButton'
import RefreshButton from '@/components/common/buttons/RefreshButton'
//========== STORES ==========
const dateStore = useDateTimeStore()
//========== VARIABLES ==========
let intervalId = 0
const timeZone = ref(dateStore.date.tz)
//========== COMPUTED ==========
const currentDateTime = computed(() => {
  return `${dateStore.date.date} ${dateStore.date.time}`
})
const timeZonesRange = computed(() => {
  return range(-12, 13).map((tz) => {
    let timeZone = 'GMT'
    if (tz > 0) timeZone += `+${tz}:00`
    if (tz < 0) timeZone += `${tz}:00`
    return {
      value: tz,
      title: timeZone
    }
  })
})
//========== METHODS ==========
const setTimeZone = () => {
  dateStore.setTimeZone(timeZone.value)
}
//========== ON MOUNTED ==========
onMounted(() => {
  dateStore.getGpsSync()
  intervalId = setInterval(() => {
    dateStore.getDateTime()
  }, 1000)
})
//========== ON BEFORE ROUTER LEAVE ==========
onBeforeRouteLeave(() => {
  clearInterval(intervalId)
})
</script>
