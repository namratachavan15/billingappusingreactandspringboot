package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.Sale;

import java.util.List;

public interface SaleService {
    public List<Sale> getAll();
    public Sale save(Sale sale);
    public Sale getById(Long id);
    public Sale update(Long id, Sale sale);
    public void delete(Long id);
    public List<Sale> search(String key);
    Sale getByBillNo(String billNo);
}
