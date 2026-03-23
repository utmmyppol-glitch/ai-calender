import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'

class WebSocketService {
  constructor() {
    this.client = null
    this.subscriptions = new Map()
    this.connected = false
    this.reconnectAttempts = 0
    this.maxReconnect = 10
  }

  connect(userId, onModeChange, onNotification) {
    if (this.client?.active) return

    this.client = new Client({
      webSocketFactory: () => new SockJS('/ws/mode'),
      reconnectDelay: 3000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        this.connected = true
        this.reconnectAttempts = 0
        console.log('[WS] Connected')

        // 모드 전환 이벤트 구독
        this.subscriptions.set(
          'mode',
          this.client.subscribe(`/topic/mode/${userId}`, (msg) => {
            try {
              const event = JSON.parse(msg.body)
              onModeChange?.(event)
            } catch (e) {
              console.error('[WS] Parse error:', e)
            }
          })
        )

        // 알림 구독
        this.subscriptions.set(
          'notification',
          this.client.subscribe(`/topic/notification/${userId}`, (msg) => {
            try {
              const event = JSON.parse(msg.body)
              onNotification?.(event)
            } catch (e) {
              console.error('[WS] Parse error:', e)
            }
          })
        )
      },

      onDisconnect: () => {
        this.connected = false
        console.log('[WS] Disconnected')
      },

      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame.headers?.message)
        this.reconnectAttempts++
      },
    })

    this.client.activate()
  }

  disconnect() {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
    this.subscriptions.clear()
    this.client?.deactivate()
    this.connected = false
  }

  isConnected() {
    return this.connected
  }
}

export const wsService = new WebSocketService()
