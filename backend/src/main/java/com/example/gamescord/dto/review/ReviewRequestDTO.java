<<<<<<< HEAD
package com.example.mvctest.dto;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
=======
package com.example.gamescord.dto.review;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
>>>>>>> origin/feature/backend/develop1
import lombok.Setter;

@Getter
@Setter
<<<<<<< HEAD
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequestDTO {
    @NotNull(message = "게임메이트 ID는 필수입니다")
    private Long gamematesId;

    @NotNull(message = "평점은 필수입니다")
    @Min(value = 1, message = "평점은 1~5점입니다")
    @Max(value = 5, message = "평점은 1~5점입니다")
    private Integer score;

    @Size(max = 255, message = "리뷰는 255자 이하여야 합니다")
    private String review;
}
=======
public class ReviewRequestDTO {

    @NotNull(message = "점수는 필수입니다.")
    @Min(value = 1, message = "점수는 1 이상이어야 합니다.")
    @Max(value = 5, message = "점수는 5 이하여야 합니다.")
    private Integer score;

    @Size(max = 255, message = "리뷰는 255자 이하여야 합니다.")
    private String review;
}
>>>>>>> origin/feature/backend/develop1
