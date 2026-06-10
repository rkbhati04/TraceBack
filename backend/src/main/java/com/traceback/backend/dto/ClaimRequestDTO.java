package com.traceback.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClaimRequestDTO {

    @NotBlank(message = "Proof of ownership is required")
    private String proofOfOwnership;

}
