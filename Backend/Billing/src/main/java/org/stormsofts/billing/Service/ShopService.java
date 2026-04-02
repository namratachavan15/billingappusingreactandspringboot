package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.Shop;

import java.util.List;
import java.util.Optional;

public interface ShopService {

    List<Shop> getAllShops(String search);
    public Optional<Shop> getShopById(Long id);
    public Shop addShop(Shop shop);
    public Shop updateShop(Long id, Shop shopDetails);
    public void deleteShop(Long id);
}
