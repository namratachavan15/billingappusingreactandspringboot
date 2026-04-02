package org.stormsofts.billing.model;

public class CreateShopRequest {
    private String shopName;
    private String ownerName;
    private String mobile;
    private String email;
    private String password; // for User table

    public CreateShopRequest(String shopName, String ownerName, String mobile, String email, String password) {
        this.shopName = shopName;
        this.ownerName = ownerName;
        this.mobile = mobile;
        this.email = email;
        this.password = password;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public String getMobile() {
        return mobile;
    }

    public void setMobile(String mobile) {
        this.mobile = mobile;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
