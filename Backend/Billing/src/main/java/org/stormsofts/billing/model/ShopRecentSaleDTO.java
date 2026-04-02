package org.stormsofts.billing.model;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor

public class ShopRecentSaleDTO {
    private String shopName;
    private String billNo;
    private Double totalAmount;

    public ShopRecentSaleDTO(String shopName, String billNo, Double totalAmount) {
        this.shopName = shopName;
        this.billNo = billNo;
        this.totalAmount = totalAmount;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getBillNo() {
        return billNo;
    }

    public void setBillNo(String billNo) {
        this.billNo = billNo;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}

