package org.stormsofts.billing.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
//@AllArgsConstructor
public class AdminDashboardResponse {

    private Double todaySales;
    private Double todayPurchase;
    private Double todayProfit;

    private Double monthlySales;
    private Double monthlyPurchase;
    private Double monthlyProfit;

    private Long totalShops;
    private Long totalProducts;
    private Long totalCustomers;
    private Long totalSuppliers;



    private List<ShopLowStockDTO> lowStockByShop;
    private List<ShopRecentSaleDTO> recentSalesByShop;
    private List<ShopRecentPurchaseDTO> recentPurchasesByShop;
    private List<ShopSalesSummaryDTO> topShopsBySales;

    public AdminDashboardResponse(Double todaySales, Double todayPurchase, Double todayProfit, Double monthlySales, Double monthlyPurchase, Double monthlyProfit, Long totalShops, Long totalProducts, Long totalCustomers, Long totalSuppliers, List<ShopLowStockDTO> lowStockByShop, List<ShopRecentSaleDTO> recentSalesByShop, List<ShopRecentPurchaseDTO> recentPurchasesByShop, List<ShopSalesSummaryDTO> topShopsBySales) {
        this.todaySales = todaySales;
        this.todayPurchase = todayPurchase;
        this.todayProfit = todayProfit;
        this.monthlySales = monthlySales;
        this.monthlyPurchase = monthlyPurchase;
        this.monthlyProfit = monthlyProfit;
        this.totalShops = totalShops;
        this.totalProducts = totalProducts;
        this.totalCustomers = totalCustomers;
        this.totalSuppliers = totalSuppliers;
        this.lowStockByShop = lowStockByShop;
        this.recentSalesByShop = recentSalesByShop;
        this.recentPurchasesByShop = recentPurchasesByShop;
        this.topShopsBySales = topShopsBySales;
    }

    public Double getTodaySales() {
        return todaySales;
    }

    public void setTodaySales(Double todaySales) {
        this.todaySales = todaySales;
    }

    public Double getTodayPurchase() {
        return todayPurchase;
    }

    public void setTodayPurchase(Double todayPurchase) {
        this.todayPurchase = todayPurchase;
    }

    public Double getTodayProfit() {
        return todayProfit;
    }

    public void setTodayProfit(Double todayProfit) {
        this.todayProfit = todayProfit;
    }

    public Double getMonthlySales() {
        return monthlySales;
    }

    public void setMonthlySales(Double monthlySales) {
        this.monthlySales = monthlySales;
    }

    public Double getMonthlyPurchase() {
        return monthlyPurchase;
    }

    public void setMonthlyPurchase(Double monthlyPurchase) {
        this.monthlyPurchase = monthlyPurchase;
    }

    public Double getMonthlyProfit() {
        return monthlyProfit;
    }

    public void setMonthlyProfit(Double monthlyProfit) {
        this.monthlyProfit = monthlyProfit;
    }

    public Long getTotalShops() {
        return totalShops;
    }

    public void setTotalShops(Long totalShops) {
        this.totalShops = totalShops;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }

    public Long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(Long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public Long getTotalSuppliers() {
        return totalSuppliers;
    }

    public void setTotalSuppliers(Long totalSuppliers) {
        this.totalSuppliers = totalSuppliers;
    }

    public List<ShopLowStockDTO> getLowStockByShop() {
        return lowStockByShop;
    }

    public void setLowStockByShop(List<ShopLowStockDTO> lowStockByShop) {
        this.lowStockByShop = lowStockByShop;
    }

    public List<ShopRecentSaleDTO> getRecentSalesByShop() {
        return recentSalesByShop;
    }

    public void setRecentSalesByShop(List<ShopRecentSaleDTO> recentSalesByShop) {
        this.recentSalesByShop = recentSalesByShop;
    }

    public List<ShopRecentPurchaseDTO> getRecentPurchasesByShop() {
        return recentPurchasesByShop;
    }

    public void setRecentPurchasesByShop(List<ShopRecentPurchaseDTO> recentPurchasesByShop) {
        this.recentPurchasesByShop = recentPurchasesByShop;
    }

    public List<ShopSalesSummaryDTO> getTopShopsBySales() {
        return topShopsBySales;
    }

    public void setTopShopsBySales(List<ShopSalesSummaryDTO> topShopsBySales) {
        this.topShopsBySales = topShopsBySales;
    }
}

