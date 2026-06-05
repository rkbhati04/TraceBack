package com.traceback.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.traceback.backend.model.Claim;
import java.util.List;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByItemId(Long itemId);
    List<Claim> findByClaimerId(Long claimerId);
}

