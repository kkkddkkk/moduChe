package com.example.moduche.global.search;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

@Getter
@AllArgsConstructor
public class SearchResponse<T> {

    private List<T> items;
    private long total;
}
