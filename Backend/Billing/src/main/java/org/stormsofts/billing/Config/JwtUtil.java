package org.stormsofts.billing.Config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    private static final String SECRET =
            "stormsofts_secret_stormsofts_secret_32_chars!"; // ≥32 chars

    private static final long EXP = 1000 * 60 * 60 * 24; // 24 hours

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(Long userId, String role, Long shopId) {

        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("role", role);

        if (shopId != null) {
            claims.put("shopId", shopId);
        }

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(String.valueOf(userId))
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXP))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256) // ✅ SAME KEY
                .compact();
    }

    public Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey()) // ✅ SAME KEY
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
