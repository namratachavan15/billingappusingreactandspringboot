package org.stormsofts.billing.model;

import lombok.AllArgsConstructor;
import lombok.Data;


import java.util.List;

@Data

public class OwnerDashboardResponse {

    private double todaySales;
    private double todayPurchase;
    private double monthlySales;
    private double monthlyPurchase;

    private long totalProducts;
    private long lowStockCount;
    private long totalCustomers;
    private long totalSuppliers;

    private double todayProfit;
    private double monthlyProfit;

    private List<DailyChartDTO> sales7Days;
    private List<MonthlyChartDTO> sales6Months;
    private List<ProductChartDTO> topSellingProducts;

    private List<Stock> lowStockProducts;
    private List<Sale> recentSales;
    private List<Purchase> recentPurchases;

    public OwnerDashboardResponse(double todaySales, double todayPurchase, double monthlySales, double monthlyPurchase, long totalProducts, long lowStockCount, long totalCustomers, long totalSuppliers, double todayProfit, double monthlyProfit, List<DailyChartDTO> sales7Days, List<MonthlyChartDTO> sales6Months, List<ProductChartDTO> topSellingProducts, List<Stock> lowStockProducts, List<Sale> recentSales, List<Purchase> recentPurchases) {
        this.todaySales = todaySales;
        this.todayPurchase = todayPurchase;
        this.monthlySales = monthlySales;
        this.monthlyPurchase = monthlyPurchase;
        this.totalProducts = totalProducts;
        this.lowStockCount = lowStockCount;
        this.totalCustomers = totalCustomers;
        this.totalSuppliers = totalSuppliers;
        this.todayProfit = todayProfit;
        this.monthlyProfit = monthlyProfit;
        this.sales7Days = sales7Days;
        this.sales6Months = sales6Months;
        this.topSellingProducts = topSellingProducts;
        this.lowStockProducts = lowStockProducts;
        this.recentSales = recentSales;
        this.recentPurchases = recentPurchases;
    }

    public double getTodaySales() {
        return todaySales;
    }

    public void setTodaySales(double todaySales) {
        this.todaySales = todaySales;
    }

    public double getTodayPurchase() {
        return todayPurchase;
    }

    public void setTodayPurchase(double todayPurchase) {
        this.todayPurchase = todayPurchase;
    }

    public double getMonthlySales() {
        return monthlySales;
    }

    public void setMonthlySales(double monthlySales) {
        this.monthlySales = monthlySales;
    }

    public double getMonthlyPurchase() {
        return monthlyPurchase;
    }

    public void setMonthlyPurchase(double monthlyPurchase) {
        this.monthlyPurchase = monthlyPurchase;
    }

    public long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public long getLowStockCount() {
        return lowStockCount;
    }

    public void setLowStockCount(long lowStockCount) {
        this.lowStockCount = lowStockCount;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public double getTodayProfit() {
        return todayProfit;
    }

    public void setTodayProfit(double todayProfit) {
        this.todayProfit = todayProfit;
    }

    public double getMonthlyProfit() {
        return monthlyProfit;
    }

    public void setMonthlyProfit(double monthlyProfit) {
        this.monthlyProfit = monthlyProfit;
    }

    public List<DailyChartDTO> getSales7Days() {
        return sales7Days;
    }

    public void setSales7Days(List<DailyChartDTO> sales7Days) {
        this.sales7Days = sales7Days;
    }

    public List<MonthlyChartDTO> getSales6Months() {
        return sales6Months;
    }

    public void setSales6Months(List<MonthlyChartDTO> sales6Months) {
        this.sales6Months = sales6Months;
    }

    public List<ProductChartDTO> getTopSellingProducts() {
        return topSellingProducts;
    }

    public void setTopSellingProducts(List<ProductChartDTO> topSellingProducts) {
        this.topSellingProducts = topSellingProducts;
    }

    public List<Stock> getLowStockProducts() {
        return lowStockProducts;
    }

    public void setLowStockProducts(List<Stock> lowStockProducts) {
        this.lowStockProducts = lowStockProducts;
    }

    public List<Sale> getRecentSales() {
        return recentSales;
    }

    public void setRecentSales(List<Sale> recentSales) {
        this.recentSales = recentSales;
    }

    public List<Purchase> getRecentPurchases() {
        return recentPurchases;
    }

    public void setRecentPurchases(List<Purchase> recentPurchases) {
        this.recentPurchases = recentPurchases;
    }
}
