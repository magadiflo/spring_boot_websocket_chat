package dev.magadiflo.websocketserver.dto;

public record ChatMessage(String content, String sender, MessageType type) {
}
