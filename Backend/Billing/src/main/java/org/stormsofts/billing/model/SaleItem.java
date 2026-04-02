package org.stormsofts.billing.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "sale_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long saleItemId;

    @ManyToOne
    @JoinColumn(name = "sale_id")
    @JsonBackReference
    private Sale sale;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private Double quantity;
    private Double unitPriceWithGst; // price per unit including GST
    private Double totalAmount;

    @Column(nullable = false)
    private Double taxableAmount = 0.0;

    @Column(nullable = false)
    private Double cgstAmount = 0.0;

    @Column(nullable = false)
    private Double sgstAmount = 0.0;

    @ManyToOne
    @JoinColumn(name = "size_id")
    private SizeMaster size;

    @Column(nullable = false)
    private Double discountPercent = 0.0; // 🔥 NEW

    @PrePersist
    @PreUpdate
    public void ensureNotNull() {
        if (taxableAmount == null) taxableAmount = 0.0;
        if (cgstAmount == null) cgstAmount = 0.0;
        if (sgstAmount == null) sgstAmount = 0.0;
        if (discountPercent == null) discountPercent = 0.0; // 🔥 NEW
    }

    public void calculateTaxes() {
        this.taxableAmount = 0.0;
        this.cgstAmount = 0.0;
        this.sgstAmount = 0.0;
        this.totalAmount = 0.0;

        if (unitPriceWithGst == null || quantity == null || product == null) return;

        double discountedUnitPrice = unitPriceWithGst - (unitPriceWithGst * discountPercent / 100); // 🔥 USE SALE ITEM DISCOUNT

        if (product.getGst() == null || product.getGst().getGstRate() == null) {
            this.totalAmount = discountedUnitPrice * quantity;
            this.taxableAmount = this.totalAmount;
            return;
        }

        double gstRate = product.getGst().getGstRate();
        double gstFraction = gstRate / 100;

        double taxableUnitPrice = discountedUnitPrice / (1 + gstFraction);
        this.taxableAmount = taxableUnitPrice * quantity;
        this.cgstAmount = this.taxableAmount * (gstFraction / 2);
        this.sgstAmount = this.taxableAmount * (gstFraction / 2);
        this.totalAmount = discountedUnitPrice * quantity;
    }

    public Long getSaleItemId() {
        return saleItemId;
    }

    public void setSaleItemId(Long saleItemId) {
        this.saleItemId = saleItemId;
    }

    public Sale getSale() {
        return sale;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public Double getUnitPriceWithGst() {
        return unitPriceWithGst;
    }

    public void setUnitPriceWithGst(Double unitPriceWithGst) {
        this.unitPriceWithGst = unitPriceWithGst;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
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

    public SizeMaster getSize() {
        return size;
    }

    public void setSize(SizeMaster size) {
        this.size = size;
    }

    public Double getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(Double discountPercent) {
        this.discountPercent = discountPercent;
    }
}
