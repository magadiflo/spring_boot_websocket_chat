package dev.magadiflo.websocketserver.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@RequiredArgsConstructor
@Component
public class WebSocketEventListener {

    /**
     * Estamos escuchando un evento, ¿Cuál evento?, pues el que estamos
     * pasando por parámetro SessionDisconnectEvent
     */

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        // TODO to be implemented. Informaremos a los usuarios de la aplicación que un usuario ha abandonado el chat
    }
}