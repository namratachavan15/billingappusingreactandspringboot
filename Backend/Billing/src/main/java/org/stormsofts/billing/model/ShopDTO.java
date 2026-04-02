package org.stormsofts.billing.model;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class ShopDTO {
    private Long shopId;
    private String shopName;

    public ShopDTO(Long shopId, String shopName) {
        this.shopId = shopId;
        this.shopName = shopName;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }
}
