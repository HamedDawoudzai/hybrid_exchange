package com.exchange.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Slf4j
@Configuration
public class RequestLoggingConfig implements WebMvcConfigurer {

    private static final String ATTR_START_TIME = "requestStartTime";

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(new ApiLoggingInterceptor())
                .addPathPatterns("/api/**");
    }

    @Slf4j
    static class ApiLoggingInterceptor implements HandlerInterceptor {

        @Override
        public boolean preHandle(@NonNull HttpServletRequest request,
                                 @NonNull HttpServletResponse response,
                                 @NonNull Object handler) {
            request.setAttribute(ATTR_START_TIME, System.currentTimeMillis());
            return true;
        }

        @Override
        public void afterCompletion(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull Object handler,
                                    Exception ex) {
            Long startTime = (Long) request.getAttribute(ATTR_START_TIME);
            long duration = startTime != null ? System.currentTimeMillis() - startTime : -1;
            int status = response.getStatus();

            if (status >= 500) {
                log.error("{} {} {} ({}ms)", request.getMethod(), request.getRequestURI(), status, duration);
            } else if (status >= 400) {
                log.warn("{} {} {} ({}ms)", request.getMethod(), request.getRequestURI(), status, duration);
            } else {
                log.info("{} {} {} ({}ms)", request.getMethod(), request.getRequestURI(), status, duration);
            }
        }
    }
}
