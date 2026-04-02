package org.stormsofts.billing.model;

import lombok.Data;

@Data
public class CustomerWiseSalesReportDTO {
    private Long customerId;
    private String customerName;
    private Long totalInvoices;
    private Double totalQuantity;
    private Double taxableAmount;
    private Double cgstAmount;
    private Double sgstAmount;
    private Double netAmount;
    private Double totalGst;

    private Long shopId;

    public CustomerWiseSalesReportDTO(Number customerId, String customerName, Number totalInvoices,
                                      Number totalQuantity, Number taxableAmount,
                                      Number cgstAmount, Number sgstAmount, Number netAmount,
                                      Number shopId) {
        this.customerId = customerId != null ? customerId.longValue() : 0L;
        this.customerName = customerName;
        this.totalInvoices = totalInvoices != null ? totalInvoices.longValue() : 0L;
        this.totalQuantity = totalQuantity != null ? totalQuantity.doubleValue() : 0.0;
        this.taxableAmount = taxableAmount != null ? taxableAmount.doubleValue() : 0.0;
        this.cgstAmount = cgstAmount != null ? cgstAmount.doubleValue() : 0.0;
        this.sgstAmount = sgstAmount != null ? sgstAmount.doubleValue() : 0.0;
        this.netAmount = netAmount != null ? netAmount.doubleValue() : 0.0;
        this.shopId = shopId != null ? shopId.longValue() : 0L;

        this.totalGst = this.cgstAmount + this.sgstAmount;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getTotalInvoices() {
        return totalInvoices;
    }

    public void setTotalInvoices(Long totalInvoices) {
        this.totalInvoices = totalInvoices;
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
