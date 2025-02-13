using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc.Document;

internal sealed class DocumentVerificationOptionsDto : IPosApiResponse<DocumentVerificationOptionsResponse>
{
    public string VerificationType { get; set; }

    public IReadOnlyList<VerificationStepDto> VerificationSteps { get; set; }

    public string CurrentStepName { get; set; }

    public int Statuscode { get; set; }

    public string VerificationVendor { get; set; }

    public DocumentVerificationOptionsResponse GetData() =>
        new (statusCode: Statuscode,
            verificationSteps: VerificationSteps.Select(step => step?.GetData()).ToList(),
            verificationType: VerificationType,
            verificationVendor: VerificationVendor,
            currentStepName: CurrentStepName);
}

internal sealed class VerificationStepDto : IPosApiResponse<VerificationStepResponse>
{
    public string StepName { get; set; }

    public string StepStatus { get; set; }

    public int? PreviousAttemptStatusCode { get; set; }

    [CanBeNull]
    public string DocumentTypeUsed { get; set; }

    public IReadOnlyList<AllowedDocumentInfoDto> AllowedDocuments { get; set; }

    public VerificationStepResponse GetData() =>
        new (stepName: StepName,
            stepStatus: StepStatus,
            previousAttemptStatusCode: PreviousAttemptStatusCode,
            documentTypeUsed: DocumentTypeUsed,
            allowedDocuments: AllowedDocuments.Select(document => document.GetData()).ToList());
}

internal sealed class AllowedDocumentInfoDto : IPosApiResponse<AllowedDocumentInfoResponse>
{
    public string DocumentType { get; set; }

    public string DocumentTypeDescription { get; set; }

    public string InitiateMethod { get; set; }

    public AllowedDocumentInfoResponse GetData() =>
        new (documentType: DocumentType,
            documentTypeDescription: DocumentTypeDescription,
            initiateMethod: InitiateMethod);
}
