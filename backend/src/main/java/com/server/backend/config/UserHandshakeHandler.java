package com.server.backend.config;

import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.lang.Nullable;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;
import org.springframework.web.util.UriComponentsBuilder;

import java.security.Principal;
import java.util.Map;

/**
 * Handshake handler that creates a Principal from the "user" header (if present).
 * Useful for dev where you don't have Spring Security.
 */

public class UserHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(ServerHttpRequest request, WebSocketHandler wsHandler, Map<String, Object> attributes) {
        Object o = attributes.get("userEmail");
        if (o instanceof String) {
            return new StompPrincipal((String) o);
        }
        // fallback to default behavior
        return super.determineUser(request, wsHandler, attributes);
    }
}