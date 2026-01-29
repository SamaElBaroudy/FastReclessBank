package com.fastrecklessbank.bank.dto;

import java.math.BigDecimal;
import java.util.UUID;

import com.fastrecklessbank.bank.model.OutgoingTransfer;

public record AccountDetailsResponse(
        UUID id,
        BigDecimal balance, 
        OutgoingTransfer[] lastOutgoingTransfers
) {}
