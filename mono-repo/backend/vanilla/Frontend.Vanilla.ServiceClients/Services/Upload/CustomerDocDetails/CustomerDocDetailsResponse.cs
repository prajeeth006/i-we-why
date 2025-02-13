using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;

/// <summary>
/// Customer document details response.
/// </summary>
internal sealed class CustomerDocDetailsResponse(List<DocumentVerificationStatus> documentVerificationStatus = default)
{
    /// <summary>
    /// Document verification status list.
    /// </summary>
    public List<DocumentVerificationStatus> DocumentVerificationStatus { get; set; } = documentVerificationStatus ?? new List<DocumentVerificationStatus>();
}

internal sealed class DocumentVerificationStatus(
    List<DocumentDetails> documentDetails = default,
    string useCase = default,
    bool isVerified = default,
    DateTime? verifiedTime = default)
{
    /// <summary>
    /// Document details list.
    /// </summary>
    public List<DocumentDetails> DocumentDetails { get; set; } = documentDetails ?? new List<DocumentDetails>();

    /// <summary>
    /// Is verified.
    /// </summary>
    public bool IsVerified { get; set; } = isVerified;

    /// <summary>
    /// Use case: TWO-PLUS-TWO; KYC; UK-KYC-REFRESH, etc.
    /// </summary>
    public string UseCase { get; set; } = useCase;

    /// <summary>
    /// Verified time.
    /// </summary>
    public DateTime? VerifiedTime { get; } = verifiedTime;
}

internal sealed class DocumentDetails(
    string documentStatus = default,
    string documentType = default,
    DateTime? documentStatusLastUpdated = null,
    DateTime uploadedDate = default,
    string uploadedReason = default,
    int documentsCount = default)
{
    /// <summary>
    /// Document status.
    /// Mutate according to `KycConfiguration.DocumentVerificationStatus` mappings.
    /// </summary>
    public string DocumentStatus { get; set; } = documentStatus;

    /// <summary>
    /// Document type: PASSPORT, etc.
    /// </summary>
    public string DocumentType { get; set; } = documentType;

    /// <summary>
    /// Document status last updated date.
    /// </summary>
    public DateTime? DocumentStatusLastUpdated { get; } = documentStatusLastUpdated;

    /// <summary>
    /// Uploaded date.
    /// </summary>
    public DateTime UploadedDate { get; } = uploadedDate;

    /// <summary>
    /// Uploaded reason: ACCOUNT-ON-HOLD, ACCOUNT-VERIFICATION, etc.
    /// </summary>
    public string UploadedReason { get; } = uploadedReason;

    /// <summary>
    /// Internal property. Used to indicate the failed documents count.
    /// </summary>
    public int DocumentsCount { get; } = documentsCount;
}
