package com.example.moduche.domain.admin.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.moduche.domain.admin.dto.FetchCommunityDTO;
import com.example.moduche.domain.community.enums.CommunityStatus;
import com.example.moduche.domain.community.repository.CommunityRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Log4j2
@Transactional
@Service
@RequiredArgsConstructor
public class AdminCommunityService {

	private final CommunityRepository communityRepository;

	public Page<FetchCommunityDTO> getCommunities(int page, int size, 
			String keyword, CommunityStatus status) {
	    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
	    return communityRepository.findFetchCommunityDTOList(pageable, keyword, status);
	}

}
