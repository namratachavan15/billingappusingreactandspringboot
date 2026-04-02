package org.stormsofts.billing.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "purchase_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long purchaseItemId;

    @ManyToOne
    @JoinColumn(name = "purchase_id")
    @JsonBackReference
    private Purchase purchase;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Double purchasePrice; // price per unit
    private Double quantity;
    private Double gstRate;
    private Double totalAmount;

    private String batchNo;
    private LocalDate expiryDate;

    @ManyToOne
    @JoinColumn(name = "size_id") // 🔹 New
    private SizeMaster size;
  //  private Double remainingQuantity;

    // Add this helper method to get price per unit including GST
    public Double getUnitPriceWithGst() {
        if(purchasePrice != null && gstRate != null) {
            return purchasePrice + (purchasePrice * gstRate / 100);
        }
        return 0.0;
    }

    public Long getPurchaseItemId() {
        return purchaseItemId;
    }

    public void setPurchaseItemId(Long purchaseItemId) {
        this.purchaseItemId = purchaseItemId;
    }

    public Purchase getPurchase() {
        return purchase;
    }

    public void setPurchase(Purchase purchase) {
        this.purchase = purchase;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Double getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(Double purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getGstRate() {
        return gstRate;
    }

    public void setGstRate(Double gstRate) {
        this.gstRate = gstRate;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }

    public String getBatchNo() {
        return batchNo;
    }

    public void setBatchNo(String batchNo) {
        this.batchNo = batchNo;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public SizeMaster getSize() {
        return size;
    }

    public void setSize(SizeMaster size) {
        this.size = size;
    }
}
