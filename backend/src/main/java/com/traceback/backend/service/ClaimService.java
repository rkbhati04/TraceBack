package com.traceback.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

import com.traceback.backend.dto.ClaimRequestDTO;
import com.traceback.backend.dto.ClaimResponseDTO;
import com.traceback.backend.dto.UserResponseDTO;
import com.traceback.backend.exception.ResourceNotFoundException;
import com.traceback.backend.model.Claim;
import com.traceback.backend.model.Item;
import com.traceback.backend.model.ItemStatus;
import com.traceback.backend.model.ItemType;
import com.traceback.backend.model.User;
import com.traceback.backend.repository.ClaimRepository;
import com.traceback.backend.repository.ItemRepository;
import com.traceback.backend.repository.UserRepository;

@Service
public class ClaimService {

    @Autowired
    private ClaimRepository claimRepo;

    @Autowired
    private ItemRepository itemRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private ItemService itemService;

    public ClaimResponseDTO submitClaim(Long itemId, ClaimRequestDTO claimDto, String username) {
        User user = userRepo.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Item item = itemRepo.findById(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Item not found"));

        if (item.getType() != ItemType.FOUND) {
            throw new IllegalArgumentException("Can only claim FOUND items");
        }

        if (item.getStatus() == ItemStatus.RESOLVED) {
            throw new IllegalArgumentException("Item is already resolved/returned");
        }

        if (item.getReporter().getId().equals(user.getId())) {
            throw new IllegalArgumentException("You cannot claim an item you reported");
        }

        Claim claim = Claim.builder()
            .item(item)
            .claimer(user)
            .proofOfOwnership(claimDto.getProofOfOwnership())
            .build();

        Claim savedClaim = claimRepo.save(claim);
        return mapToDTO(savedClaim);
    }

    public List<ClaimResponseDTO> getMyClaims(String username) {
        User user = userRepo.findByUsername(username)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return claimRepo.findByClaimerId(user.getId()).stream()
            .map(this::mapToDTO)
            .collect(Collectors.toList());
    }

    private ClaimResponseDTO mapToDTO(Claim claim) {
        UserResponseDTO claimerDto = UserResponseDTO.builder()
            .id(claim.getClaimer().getId())
            .username(claim.getClaimer().getUsername())
            .email(claim.getClaimer().getEmail())
            .phoneNumber(claim.getClaimer().getPhoneNumber())
            .role(claim.getClaimer().getRole())
            .createdAt(claim.getClaimer().getCreatedAt())
            .build();

        return ClaimResponseDTO.builder()
            .id(claim.getId())
            .item(itemService.mapToDTO(claim.getItem()))
            .claimer(claimerDto)
            .proofOfOwnership(claim.getProofOfOwnership())
            .status(claim.getStatus())
            .createdAt(claim.getCreatedAt())
            .build();
    }
}
