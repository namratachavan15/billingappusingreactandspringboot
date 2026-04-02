package org.stormsofts.billing.model;


import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data

public class DailySalesReportDTO {

    private LocalDate saleDate;
    private Long billCount;
    private Double totalQuantity;
    private Double taxableAmount;
    private Double cgstAmount;
    private Double sgstAmount;
    private Double netAmount;
    private Long shopId; // NEW

    public DailySalesReportDTO(LocalDate saleDate, Long billCount, Double totalQuantity, Double taxableAmount, Double cgstAmount, Double sgstAmount, Double netAmount, Long shopId) {
        this.saleDate = saleDate;
        this.billCount = billCount;
        this.totalQuantity = totalQuantity;
        this.taxableAmount = taxableAmount;
        this.cgstAmount = cgstAmount;
        this.sgstAmount = sgstAmount;
        this.netAmount = netAmount;
        this.shopId = shopId;
    }

    public LocalDate getSaleDate() {
        return saleDate;
    }

    public void setSaleDate(LocalDate saleDate) {
        this.saleDate = saleDate;
    }

    public Long getBillCount() {
        return billCount;
    }

    public void setBillCount(Long billCount) {
        this.billCount = billCount;
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

    public Long getShopId() {
        return shopId;
    }

    public void setShopId(Long shopId) {
        this.shopId = shopId;
    }
}
