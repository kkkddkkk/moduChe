package com.example.moduche.global.search;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {

    private final CourseSearchService courseSearchService;
    private final CommunitySearchService communitySearchService;

    @PostMapping
    public ResponseEntity<?> search(@RequestBody SearchRequest req) {
    	
    	
    	System.out.println("🔍 [SearchController] req = " + req);
    	
        if (req.getBoardType() == null) {
            return ResponseEntity.badRequest().body("boardType is required");
        }

        return switch (req.getBoardType()) {
            case COURSE -> {
                SearchResponse<CourseSearchResultDto> res =
                        courseSearchService.search(req);
                yield ResponseEntity.ok(res);
            }
            case COMMUNITY -> {
                SearchResponse<CommunitySearchResultDto> res =
                        communitySearchService.search(req);
                yield ResponseEntity.ok(res);
            }
        };
    }
}
