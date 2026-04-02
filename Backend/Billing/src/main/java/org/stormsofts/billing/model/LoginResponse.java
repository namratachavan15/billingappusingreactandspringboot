package org.stormsofts.billing.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String token;
    private Long userId;
    private String role;
    private Long shopId;
    private Long employeeId;
    private String shopName;
    private Boolean profileCompleted;

    public LoginResponse(String token, Long userId, String role, Long shopId, Long employeeId, String shopName, Boolean profileCompleted) {
        this.token = token;
        this.userId = userId;
        this.role = role;
        this.shopId = shopId;
        this.employeeId = employeeId;
        this.shopName = shopName;
        this.profileCompleted = profileCompleted;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public Long getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Long employeeId) {
        this.employeeId = employeeId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public Boolean getProfileCompleted() {
        return profileCompleted;
    }

    public void setProfileCompleted(Boolean profileCompleted) {
        this.profileCompleted = profileCompleted;
    }
}
