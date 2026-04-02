package org.stormsofts.billing.Service;

import org.stormsofts.billing.model.Customer;
import java.util.List;

public interface CustomerService {

    Customer saveCustomer(Customer customer);

    List<Customer> getAllCustomers();

    Customer getCustomerById(Long id);

    void deleteCustomer(Long id);

    Customer updateCustomer(Long id, Customer customer);

    List<Customer> searchCustomers(String keyword);
}
