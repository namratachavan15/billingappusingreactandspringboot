package org.stormsofts.billing;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BillingApplication {

    public static void main(String[] args) {

        String rawPassword = "admin123";
        org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder =
                new org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder();
        String hashed = encoder.encode(rawPassword);
        System.out.println(hashed);
        SpringApplication.run(BillingApplication.class, args);

    }

}
