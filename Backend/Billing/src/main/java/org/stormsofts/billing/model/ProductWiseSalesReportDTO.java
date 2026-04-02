package org.stormsofts.billing.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;



import lombok.Data;

@Data
public class ProductWiseSalesReportDTO {

    private Long productId;
    private String productName;

    private Double totalQuantity;
    private Double taxableAmount;
    private Double cgstAmount;
    private Double sgstAmount;

    private Double netAmount;
    private Double totalGst;
    private Long shopId;
    // Constructor for JPQL projection
    public ProductWiseSalesReportDTO(Long productId, String productName,
                                     Double totalQuantity, Double taxableAmount,
                                     Double cgstAmount, Double sgstAmount,
                                     Double netAmount,Long shopId) {
        this.productId = productId;
        this.productName = productName;
        this.totalQuantity = totalQuantity;
        this.taxableAmount = taxableAmount;
        this.cgstAmount = cgstAmount;
        this.sgstAmount = sgstAmount;
        this.netAmount = netAmount;
this.shopId = shopId;
        // Calculate Total GST here
        this.totalGst = (cgstAmount != null ? cgstAmount : 0) + (sgstAmount != null ? sgstAmount : 0);
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getTotalQuantity() {
        return totalQuantity;
    }

    public void setTotalQuantity(Double totalQuantity) {
        this.totalQuantity = totalQuantity;
    }

    public Double getTaxableAmount() {
        return taxableAmount;
    }

    public void setTaxableAmount(Double taxableAmount) {
        this.taxableAmount = taxableAmount;
    }

    public Double getCgstAmount() {
        return cgstAmount;
    }

    public void setCgstAmount(Double cgstAmount) {
        this.cgstAmount = cgstAmount;
    }

    public Double getSgstAmount() {
        return sgstAmount;
    }

    public void setSgstAmount(Double sgstAmount) {
        this.sgstAmount = sgstAmount;
    }

    public Double getNetAmount() {
        return netAmount;
    }

    public void setNetAmount(Double netAmount) {
        this.netAmount = netAmount;
    }

    public Double getTotalGst() {
        return totalGst;
    }

    public void setTotalGst(Double totalGst) {
        this.totalGst = totalGst;
    }

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }
}
