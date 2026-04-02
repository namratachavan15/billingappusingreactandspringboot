package org.stormsofts.billing.Controller;


import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.stormsofts.billing.Service.EmployeeService;
import org.stormsofts.billing.model.Employee;


import java.util.List;

@RestController
@RequestMapping("/api/employees")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class EmployeeController {

    @Autowired
    private  EmployeeService service;

    @GetMapping
    public List<Employee> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Employee save(@RequestBody Employee emp) {
        return service.save(emp);
    }

    @PutMapping("/{id}")
    public Employee update(@PathVariable Long id, @RequestBody Employee emp) {
        return service.update(id, emp);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/search")
    public List<Employee> search(@RequestParam String key) {
        return service.search(key);
    }
}
