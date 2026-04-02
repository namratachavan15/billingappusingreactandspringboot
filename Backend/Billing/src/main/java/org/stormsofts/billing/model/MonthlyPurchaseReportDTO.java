package org.stormsofts.billing.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MonthlyPurchaseReportDTO {
    private Integer year;
    private Integer month;
    private Long billCount;
    private Double totalQuantity;
    private Double taxableAmount;
    private Double cgstAmount;
    private Double sgstAmount;
    private Double netAmount;
    private Long shopId;

    public MonthlyPurchaseReportDTO(Integer year, Integer month, Long billCount, Double totalQuantity, Double taxableAmount, Double cgstAmount, Double sgstAmount, Double netAmount, Long shopId) {
        this.year = year;
        this.month = month;
        this.billCount = billCount;
        this.totalQuantity = totalQuantity;
        this.taxableAmount = taxableAmount;
        this.cgstAmount = cgstAmount;
        this.sgstAmount = sgstAmount;
        this.netAmount = netAmount;
        this.shopId = shopId;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
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
