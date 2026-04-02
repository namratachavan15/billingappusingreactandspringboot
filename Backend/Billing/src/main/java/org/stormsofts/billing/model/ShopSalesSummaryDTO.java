package org.stormsofts.billing.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data

public class ShopSalesSummaryDTO {
    private String shopName;
    private Double totalSales;

    public ShopSalesSummaryDTO(String shopName, Double totalSales) {
        this.shopName = shopName;
        this.totalSales = totalSales;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public Double getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Double totalSales) {
        this.totalSales = totalSales;
    }
}
