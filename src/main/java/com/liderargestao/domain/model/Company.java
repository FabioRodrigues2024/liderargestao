package com.liderargestao.domain.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@Entity
@Table(name = "companies")
public class Company {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String cnpj;

    private String address;

    @Column(name = "main_email", nullable = false)
    private String mainEmail;

    @Column(name = "commercial_email")
    private String commercialEmail;

    private String phone;

    @Column(name = "accounting_id")
    private String accountingId;

    @OneToMany(mappedBy = "company")
    private Set<User> users;

    private boolean active;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private CompanyStatus status;

    @ElementCollection
    @CollectionTable(name = "company_permissions")
    private Set<String> permissions;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = CompanyStatus.PENDING;
        }
    }
}