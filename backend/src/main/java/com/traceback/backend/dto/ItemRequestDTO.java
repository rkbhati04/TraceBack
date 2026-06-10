package com.traceback.backend.dto;

import com.traceback.backend.model.Category;
import com.traceback.backend.model.ItemType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ItemRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Type is required")
    private ItemType type;

    @NotNull(message = "Category is required")
    private Category category;

    @NotBlank(message = "Location is required")
    private String location;

    @NotNull(message = "Date occurred is required")
    private LocalDate dateOccurred;

    private String imageUrl;
}
