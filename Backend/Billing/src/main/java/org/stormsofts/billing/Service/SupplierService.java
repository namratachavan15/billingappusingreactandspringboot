package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.Supplier;
import java.util.List;

public interface SupplierService {
    List<Supplier> getAll();
    Supplier save(Supplier sup);
    Supplier update(Long id, Supplier sup);
    void delete(Long id);
    List<Supplier> search(String key);
}
