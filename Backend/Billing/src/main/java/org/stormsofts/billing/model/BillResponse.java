package org.stormsofts.billing.model;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data

public class BillResponse {
    private Shop shop;
    private Sale sale;

    public BillResponse(Shop shop, Sale sale) {
        this.shop = shop;
        this.sale = sale;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Sale getSale() {
        return sale;
    }

    public void setSale(Sale sale) {
        this.sale = sale;
    }
}
