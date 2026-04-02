package org.stormsofts.billing.model;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data

public class ProductChartDTO {
    private String productName;
    private double quantity;

    public ProductChartDTO(String productName, double quantity) {
        this.productName = productName;
        this.quantity = quantity;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }
}
