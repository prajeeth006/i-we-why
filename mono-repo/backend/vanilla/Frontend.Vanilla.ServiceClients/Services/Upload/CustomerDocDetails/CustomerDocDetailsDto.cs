using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;

internal sealed class CustomerDocDetailsDto : IPosApiResponse<CustomerDocDetailsResponse>
{
    public IReadOnlyList<DocumentVerificationStatusDto> DocumentVerificationStatus { get; set; }

    public CustomerDocDetailsResponse GetData() =>
        new (documentVerificationStatus: DocumentVerificationStatus?.Select(status => status.GetData()).ToList());
}

internal sealed class DocumentVerificationStatusDto : IPosApiResponse<DocumentVerificationStatus>
{
    public IReadOnlyList<DocumentDetailsDto> DocumentDetails { get; set; }

    public bool IsVerified { get; set; }

    public string UseCase { get; set; }

    public DateTime? VerifiedTime { get; set; }

    public DocumentVerificationStatus GetData() => new (
        documentDetails: DocumentDetails?.Select(details => details.GetData()).ToList(),
        isVerified: IsVerified,
        useCase: UseCase,
        verifiedTime: VerifiedTime);
}

internal sealed class DocumentDetailsDto : IPosApiResponse<DocumentDetails>
{
    public string DocumentStatus { get; set; }

    public string DocumentType { get; set; }

    public DateTime? DocumentStatusLastUpdated { get; set; }

    public DateTime UploadedDate { get; set; }

    public string UploadedReason { get; set; }

    public DocumentDetails GetData() => new (
        documentStatus: DocumentStatus,
        documentType: DocumentType,
        documentStatusLastUpdated: DocumentStatusLastUpdated,
        uploadedDate: UploadedDate,
        uploadedReason: UploadedReason);
}
