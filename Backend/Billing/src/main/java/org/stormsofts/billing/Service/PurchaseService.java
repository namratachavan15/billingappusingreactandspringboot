package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.Purchase;

import java.util.List;

public interface PurchaseService {
    List<Purchase> getAll();
    Purchase save(Purchase pur);
    Purchase update(Long id, Purchase pur);
    void delete(Long id);
    List<Purchase> search(String key);
}
