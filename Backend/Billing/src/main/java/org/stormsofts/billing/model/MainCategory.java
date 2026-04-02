package org.stormsofts.billing.model;


import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "main_category")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MainCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("MCID")
    private Long MCID;

    @ManyToOne
    @JoinColumn(name = "MACID")
    private MasterCategory masterCategory;


    private String name;
    private Boolean status;

    public Long getMCID() {
        return MCID;
    }

    public void setMCID(Long MCID) {
        this.MCID = MCID;
    }

    public MasterCategory getMasterCategory() {
        return masterCategory;
    }

    public void setMasterCategory(MasterCategory masterCategory) {
        this.masterCategory = masterCategory;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Boolean getStatus() {
        return status;
    }

    public void setStatus(Boolean status) {
        this.status = status;
    }
}
