package org.stormsofts.billing.model;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data

public class MonthlyChartDTO {
    private int month;
    private int year;
    private double total;

    public MonthlyChartDTO(int month, int year, double total) {
        this.month = month;
        this.year = year;
        this.total = total;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }
}
