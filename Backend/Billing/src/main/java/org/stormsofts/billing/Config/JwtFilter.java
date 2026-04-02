package org.stormsofts.billing.Config;


import io.jsonwebtoken.Claims;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;

@Component
public class JwtFilter implements Filter {

    private final JwtUtil jwtUtil;


    public JwtFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest request = (HttpServletRequest) req;

        String path = request.getRequestURI();



        String auth = request.getHeader("Authorization");
        // 🔥 FALLBACK FOR IMAGE REQUESTS
        if (auth == null && request.getParameter("token") != null) {
            auth = "Bearer " + request.getParameter("token");
        }

        try {
            if (auth != null && auth.startsWith("Bearer ")) {
                Claims claims = jwtUtil.extractClaims(auth.substring(7));

                String role = claims.get("role", String.class);
                Long userId = claims.get("userId", Long.class);

                SecurityContextHolder.getContext().setAuthentication(
                        new UsernamePasswordAuthenticationToken(
                                userId, null, List.of(new SimpleGrantedAuthority(role))
                        )
                );

                request.setAttribute("shopId", claims.get("shopId", Long.class));
            }
        } catch (Exception e) {
            ((HttpServletResponse) res).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        chain.doFilter(req, res);
    }


}
