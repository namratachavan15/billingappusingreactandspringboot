package org.stormsofts.billing.Controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.stormsofts.billing.Service.ProductService;
import org.stormsofts.billing.model.Product;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@CrossOrigin(
        origins = "http://localhost:5173",
        allowCredentials = "true"
)
public class ProductController {

    @Autowired
    private ProductService service;

    @GetMapping
    public List<Product> all() {
        return service.getAll();
    }

    @GetMapping("/search")
    public List<Product> search(@RequestParam String q) {
        return service.search(q);
    }

    @PostMapping
    public Product save(@RequestParam("product") String productJson,
                        @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        ObjectMapper mapper = new ObjectMapper();

        Product p = mapper.readValue(productJson, Product.class);

        if (image != null && !image.isEmpty()) {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String extension = image.getOriginalFilename()
                    .substring(image.getOriginalFilename().lastIndexOf('.'));
            String fileName = UUID.randomUUID() + extension;
            image.transferTo(new File(uploadDir + fileName));
            p.setImage(fileName);
        }

        return service.save(p);
    }

    @PutMapping("/{id}")
    public Product update(@PathVariable Long id,
                          @RequestParam("product") String productJson,
                          @RequestPart(value = "image", required = false) MultipartFile image) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        Product p = mapper.readValue(productJson, Product.class);

        if (image != null && !image.isEmpty()) {
            String uploadDir = System.getProperty("user.dir") + "/uploads/";
            File dir = new File(uploadDir);
            if (!dir.exists()) dir.mkdirs();

            String extension = image.getOriginalFilename()
                    .substring(image.getOriginalFilename().lastIndexOf('.'));
            String fileName = UUID.randomUUID() + extension;

            image.transferTo(new File(uploadDir + fileName));
            p.setImage(fileName);
        }

        return service.update(id, p);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
