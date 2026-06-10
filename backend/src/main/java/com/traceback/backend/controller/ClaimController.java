package com.traceback.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.security.Principal;
import com.traceback.backend.dto.ClaimRequestDTO;
import com.traceback.backend.dto.ClaimResponseDTO;
import com.traceback.backend.service.ClaimService;
import jakarta.validation.Valid;

@RestController
@RequestMapping
public class ClaimController {

    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/items/{itemId}/claims")
    public ResponseEntity<ClaimResponseDTO> submitClaim(@PathVariable Long itemId, 
                                                        @Valid @RequestBody ClaimRequestDTO claimDto, 
                                                        Principal principal) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(claimService.submitClaim(itemId, claimDto, principal.getName()));
    }

    @GetMapping("/claims/my-claims")
    public List<ClaimResponseDTO> getMyClaims(Principal principal) {
        return claimService.getMyClaims(principal.getName());
    }
}
