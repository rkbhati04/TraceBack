package com.traceback.backend.dto;

import com.traceback.backend.model.Category;
import com.traceback.backend.model.ItemStatus;
import com.traceback.backend.model.ItemType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemResponseDTO {
    private Long id;
    private String title;
    private String description;
    private ItemType type;
    private Category category;
    private String location;
    private LocalDate dateOccurred;
    private ItemStatus status;
    private String imageUrl;
    private UserResponseDTO reporter;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
