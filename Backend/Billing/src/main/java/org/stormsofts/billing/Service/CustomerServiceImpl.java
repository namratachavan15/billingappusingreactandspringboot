package org.stormsofts.billing.Service;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.stormsofts.billing.Repository.CustomerRepository;
import org.stormsofts.billing.Repository.ShopRepository;
import org.stormsofts.billing.model.Customer;
import org.stormsofts.billing.model.Shop;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private  CustomerRepository customerRepository;

    @Autowired
    private ShopRepository shopRepo;

    @Autowired
    private  HttpServletRequest request;   // ✅ inject request

    // ✅ REPLACED METHOD
    private Shop getCurrentShop() {
        Long shopId = (Long) request.getAttribute("shopId");

        if (shopId == null) {
            throw new RuntimeException("Shop not found in token");
        }

        return shopRepo.findById(shopId)
                .orElseThrow(() -> new RuntimeException("Shop not found"));
    }

    @Override
    public Customer saveCustomer(Customer customer) {
        customer.setCreatedAt(LocalDateTime.now());
        customer.setShop(getCurrentShop());
        return customerRepository.save(customer);
    }

    @Override
    public List<Customer> getAllCustomers() {
        return customerRepository.findByShop(getCurrentShop());
    }

    @Override
    public Customer getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Ensure the customer belongs to the current shop
        if (!customer.getShop().getShopId().equals(getCurrentShop().getShopId())) {
            throw new RuntimeException("Access denied for this customer");
        }
        return customer;
    }

    @Override
    public void deleteCustomer(Long id) {
        Customer customer = getCustomerById(id);
        customerRepository.delete(customer);
    }

    @Override
    public Customer updateCustomer(Long id, Customer customer) {
        Customer existing = getCustomerById(id);
        existing.setName(customer.getName());
        existing.setMobile(customer.getMobile());
        existing.setEmail(customer.getEmail());
        existing.setAddress(customer.getAddress());
        return customerRepository.save(existing);
    }

    @Override
    public List<Customer> searchCustomers(String keyword) {
        return customerRepository.findByShopAndNameContainingIgnoreCase(getCurrentShop(), keyword);
    }
}
