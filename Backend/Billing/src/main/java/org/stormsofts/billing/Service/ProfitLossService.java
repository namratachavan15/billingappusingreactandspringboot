package org.stormsofts.billing.Service;


import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.ProfitLossRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.model.ProfitLossDTO;
import org.stormsofts.billing.model.Shop;

import java.util.List;

@Service
public class ProfitLossService {

    private final ProfitLossRepository profitLossRepository;
    private final ShopRepository shopRepository;

    public ProfitLossService(ProfitLossRepository profitLossRepository, ShopRepository shopRepository) {
        this.profitLossRepository = profitLossRepository;
        this.shopRepository = shopRepository;
    }

    public List<ProfitLossDTO> getProfitLossByShopId(Long shopId) {
        Shop shop = shopRepository.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
        return profitLossRepository.findProfitLossByShop(shop);
    }
}
