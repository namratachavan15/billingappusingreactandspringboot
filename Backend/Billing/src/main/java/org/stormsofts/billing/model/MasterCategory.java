package org.stormsofts.billing.model;



import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "master_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MasterCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("MACID")
    private Long MACID;

    private String name;
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id")
    private Shop shop;

    private Boolean status;

    public Long getMACID() {
        return MACID;
    }

    public void setMACID(Long MACID) {
        this.MACID = MACID;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Shop getShop() {
        return shop;
    }

    public void setShop(Shop shop) {
        this.shop = shop;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
