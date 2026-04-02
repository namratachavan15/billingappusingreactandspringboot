package org.stormsofts.billing.model;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class ShopRecentPurchaseDTO {
    private String shopName;
    private String supplierName;
    private Double totalAmount;

    public ShopRecentPurchaseDTO(String shopName, String supplierName, Double totalAmount) {
        this.shopName = shopName;
        this.supplierName = supplierName;
        this.totalAmount = totalAmount;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getSupplierName() {
        return supplierName;
    }

    public void setSupplierName(String supplierName) {
        this.supplierName = supplierName;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
