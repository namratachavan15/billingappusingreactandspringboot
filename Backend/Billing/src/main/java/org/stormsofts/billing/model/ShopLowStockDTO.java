package org.stormsofts.billing.model;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class ShopLowStockDTO {
    private String shopName;
    private String productName;
    private Double quantity;

    public ShopLowStockDTO(String shopName, String productName, Double quantity) {
        this.shopName = shopName;
        this.productName = productName;
        this.quantity = quantity;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }
}
