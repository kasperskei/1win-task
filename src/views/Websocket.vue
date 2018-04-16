<template>
  <div class="websocket">
    <div>
      <label>ws delay (ms): </label>
      <input type="number" v-model.number="delay">
    </div>
    <div>
      <label>ws attempts: </label>
      <input type="number" v-model.number="attempts">
    </div>

    <ul>
      <li v-for="(it, i) in list" :key="i">
        {{ it }}
        <a @click="sendMessage(i, deleteItem)">(yдалить)</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'websocket',
  data() {
    return {
      attempts: 5,
      delay: 100,
      list: [
        'Тестовый коммент 1',
        'Это шедевр',
        'Это прекрасно',
        'Лучшее, что я видел',
        'Два чая этому автору'
      ],
      queue: [],
      ws: null
    }
  },
  methods: {
    deleteItem(index) {
      this.list.splice(index, 1)
    },
    sendMessage(message, callback) {
      this.queue.push({ message, callback })
      this.ws.send(message)
    },
    onOpen(open) {
      console.info('Соединение установлено.')
    },
    onClose(event) {
      console.warn(event.wasClean ? 'Соединение закрыто' : 'Обрыв соединения')
      console.warn(`Код: ${event.code}. Причина: ${event.reason}.`)
    },
    onMessage(event) {
      console.info(`Получены данные: ${event.data}.`)

      /// Выполняем операции над данными в порядке их отправления на сервер
      const run = (message, attempt = 0) => {
        const index = this.queue.findIndex(it => it.message == message)

        if (index === -1) return

        if (attempt >= this.attempts) {
          this.queue.splice(1, index)
        } else if (index === 0) {
          const queue = this.queue.shift()
          queue.callback(message)
        } else return setTimeout(run, this.delay, message, attempt++)
      }

      run(event.data)
    },
    onError(error) {
      console.error(`Ошибка: ${error.message}.`)
    }
  },
  created() {
    this.ws = new WebSocket('ws://echo.websocket.org/')
    this.ws.onopen = this.onOpen
    this.ws.onclose = this.onClose
    this.ws.onmessage = this.onMessage
    this.ws.onerror = this.onError
  },
  beforeDestroy() {
    this.ws.close()
  }
}
</script>

<style scoped>
a {
  color: blue;
  cursor: pointer;
}
</style>

