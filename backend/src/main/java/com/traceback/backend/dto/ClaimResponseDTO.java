package com.traceback.backend.dto;

import com.traceback.backend.model.ClaimStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimResponseDTO {
    private Long id;
    private ItemResponseDTO item;
    private UserResponseDTO claimer;
    private String proofOfOwnership;
    private ClaimStatus status;
    private LocalDateTime createdAt;
}
