package org.stormsofts.billing.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "stock",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"shop_id", "product_id", "size_size_id"})
        }
)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long stockId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop; // ✅ REQUIRED

    @ManyToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(optional = false)
    @JoinColumn(name = "size_size_id", nullable = false)
    private SizeMaster size;

    private Double quantity = 0.0;

    public Long getStockId() {

        return stockId;
    }

    public void setStockId(Long stockId) {
        this.stockId = stockId;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public SizeMaster getSize() {
        return size;
    }

    public void setSize(SizeMaster size) {
        this.size = size;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }
}
