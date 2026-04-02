package org.stormsofts.billing.model;



import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor

public class SalesPurchaseChartDTO {
    private LocalDate date;
    private double sales;
    private double purchase;

    public SalesPurchaseChartDTO(LocalDate date, double sales, double purchase) {
        this.date = date;
        this.sales = sales;
        this.purchase = purchase;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public double getSales() {
        return sales;
    }

    public void setSales(double sales) {
        this.sales = sales;
    }

    public double getPurchase() {
        return purchase;
    }

    public void setPurchase(double purchase) {
        this.purchase = purchase;
    }
}

