package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.Product;

import java.util.List;

public interface ProductService {
    List<Product> getAll();
    List<Product> search(String keyword);
    Product save(Product p);
    Product update(Long id, Product p);
    void delete(Long id);
}
