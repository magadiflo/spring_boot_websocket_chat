package dev.magadiflo.websocketserver.config;

import dev.magadiflo.websocketserver.dto.ChatMessage;
import dev.magadiflo.websocketserver.dto.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@RequiredArgsConstructor
@Component
public class WebSocketEventListener {

    private final SimpMessageSendingOperations sendingOperations;

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headers = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headers.getSessionAttributes().get("username");
        if (username != null) {
            log.info("Usuario desconectado: {}", username);
            ChatMessage chatMessage = new ChatMessage(null, username, MessageType.LEAVE);

            this.sendingOperations.convertAndSend("/topic/public", chatMessage);
        }
    }
}