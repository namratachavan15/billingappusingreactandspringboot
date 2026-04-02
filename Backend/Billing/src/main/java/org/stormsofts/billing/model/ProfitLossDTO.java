package org.stormsofts.billing.model;



import lombok.AllArgsConstructor;
import lombok.Data;

@Data

public class ProfitLossDTO {
    private String productName;
    private Double totalPurchaseAmount; // total purchase cost
    private Double totalSalesAmount;    // total sales revenue
    private Double profit;              // sales - purchase
    private Double marginPercent;       // (profit / sales) * 100

    public ProfitLossDTO(String productName, Double totalPurchaseAmount, Double totalSalesAmount, Double profit, Double marginPercent) {
        this.productName = productName;
        this.totalPurchaseAmount = totalPurchaseAmount;
        this.totalSalesAmount = totalSalesAmount;
        this.profit = profit;
        this.marginPercent = marginPercent;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Double getTotalPurchaseAmount() {
        return totalPurchaseAmount;
    }

    public void setTotalPurchaseAmount(Double totalPurchaseAmount) {
        this.totalPurchaseAmount = totalPurchaseAmount;
    }

    public Double getTotalSalesAmount() {
        return totalSalesAmount;
    }

    public void setTotalSalesAmount(Double totalSalesAmount) {
        this.totalSalesAmount = totalSalesAmount;
    }

    public Double getProfit() {
        return profit;
    }

    public void setProfit(Double profit) {
        this.profit = profit;
    }

    public Double getMarginPercent() {
        return marginPercent;
    }

    public void setMarginPercent(Double marginPercent) {
        this.marginPercent = marginPercent;
    }
}

