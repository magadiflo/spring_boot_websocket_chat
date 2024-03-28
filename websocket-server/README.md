# WebSocket

---

## Dependencias

````xml
<!--Spring Boot 3.2.4-->
<!--Java 21-->
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>

    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
````

## Creando clase de configuración

Podemos configurar Spring para habilitar la mensajería `WebSocket` y `STOMP`:

````java

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/web-socket")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }
}
````

`@EnableWebSocketMessageBroker`, esta anotación habilita la infraestructura necesaria para el soporte de WebSocket y el
enrutamiento de mensajes WebSocket en Spring. Básicamente, **activa la funcionalidad de WebSocket en tu aplicación
Spring Boot.**

`WebSocketMessageBrokerConfigurer`, esta interfaz proporciona métodos para configurar la infraestructura de `WebSocket`
en tu aplicación.

`registerStompEndpoints()` configura el `endpoint de WebSocket` que **los clientes usarán para establecer la conexión
WebSocket con el servidor.** En este caso, se está registrando un endpoint llamado `/web-socket`. Además, `withSockJS()`
habilita el soporte `SockJS` para **permitir la compatibilidad con navegadores que no admiten completamente WebSocket.**

`.setAllowedOriginPatterns("*")` dentro del método `registerStompEndpoints()` es para especificar los orígenes
permitidos para las conexiones `WebSocket`. Esto es importante para la seguridad de tu aplicación, ya que ayuda a
prevenir ataques de tipo **Cross-Origin Resource Sharing (CORS)** al restringir qué orígenes pueden acceder a tus puntos
finales WebSocket. En este caso, el `*` establece un patrón que coincide con todos los orígenes, lo que significa que
cualquier origen puede acceder al endpoint de `WebSocket`. En un entorno de producción, es posible que desees ser más
restrictivo y especificar los orígenes permitidos de manera más precisa según las necesidades de seguridad de tu
aplicación.

El método `configureMessageBroker()` configura el broker de mensajes, habilitando un broker simple y definiendo los
prefijos para los destinos de mensajes. Este método hace dos cosas:

1. Crea el `message broker (intermediario de mensajes)` en memoria con uno o más destinos para enviar y recibir
   mensajes. En el código mostrado, hay un único prefijo de destino definido: `/topic`. Sigue la convención de que los
   destinos de los mensajes que se transmitirán a todos los clientes suscritos a través del modelo pub-sub deben tener
   el prefijo `topic`. Los mensajes enviados a `/topic` serán transmitidos a todos los clientes suscritos a ese
   tema.<br><br>

2. Define el prefijo `/app` que se utiliza para filtrar destinos manejados por métodos anotados con `@MessageMapping`
   que implementará en un controlador. El controlador, después de procesar el mensaje, lo enviará al `broker`. Los
   mensajes enviados a `/app` serán enrutados a los métodos de controlador de Spring.

[![01.websocket-configuration.png](./assets/01.websocket-configuration.png)](https://www.toptal.com/java/stomp-spring-boot-websocket)

