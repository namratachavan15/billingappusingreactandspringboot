package org.stormsofts.billing.model;



import lombok.Data;

@Data
public class MonthlySalesReportDTO {

    private Integer year;
    private Integer month;

    private Long totalSales; // number of invoices
    private Double totalQuantity;
    private Double taxableAmount;
    private Double cgstAmount;
    private Double sgstAmount;
    private Double totalGst;
    private Double netAmount;
    private Long shopId;

    // JPQL constructor
    public MonthlySalesReportDTO(Integer year, Integer month,
                                 Long totalSales,
                                 Double totalQuantity,
                                 Double taxableAmount,
                                 Double cgstAmount,
                                 Double sgstAmount,
                                 Double netAmount,Long shopId) {
        this.year = year;
        this.month = month;
        this.totalSales = totalSales;
        this.totalQuantity = totalQuantity;
        this.taxableAmount = taxableAmount;
        this.cgstAmount = cgstAmount;
        this.sgstAmount = sgstAmount;
        this.netAmount = netAmount;
        this.shopId = shopId;
        this.totalGst = (cgstAmount != null ? cgstAmount : 0) + (sgstAmount != null ? sgstAmount : 0);
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

    public Long getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(Long totalSales) {
        this.totalSales = totalSales;
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

    public Double getTotalGst() {
        return totalGst;
    }

    public void setTotalGst(Double totalGst) {
        this.totalGst = totalGst;
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
