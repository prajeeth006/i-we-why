using System.Collections.Generic;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc.Document;

/// <summary>
/// Document verification options response.
/// </summary>
internal sealed class DocumentVerificationOptionsResponse(
    string verificationType = default,
    IReadOnlyList<VerificationStepResponse> verificationSteps = default,
    string currentStepName = default,
    int statusCode = default,
    string verificationVendor = default)
{
    /// <summary>
    /// Document verification type.
    /// </summary>
    public string VerificationType { get; } = verificationType;

    /// <summary>
    /// Document verification steps.
    /// </summary>
    [ItemCanBeNull]
    public IReadOnlyList<VerificationStepResponse> VerificationSteps { get; } = verificationSteps ?? new List<VerificationStepResponse>();

    /// <summary>
    /// Current step name.
    /// </summary>
    public string CurrentStepName { get; } = currentStepName;

    /// <summary>
    /// Document status code.
    /// </summary>
    public int StatusCode { get; } = statusCode;

    /// <summary>
    /// Verification vendor.
    /// </summary>
    public string VerificationVendor { get; } = verificationVendor;
}

/// <summary>
/// Document verification step response.
/// </summary>
internal sealed class VerificationStepResponse(
    string stepName = default,
    string stepStatus = default,
    int? previousAttemptStatusCode = default,
    [CanBeNull] string documentTypeUsed = default,
    IReadOnlyList<AllowedDocumentInfoResponse> allowedDocuments = default)
{
    /// <summary>
    /// Verification step name.
    /// </summary>
    public string StepName { get; } = stepName;

    /// <summary>
    /// Verification step status.
    /// </summary>
    public string StepStatus { get; } = stepStatus;

    /// <summary>
    /// Verification previous attempt status code.
    /// </summary>
    public int? PreviousAttemptStatusCode { get; } = previousAttemptStatusCode;

    /// <summary>
    /// Verification document type used.
    /// </summary>
    [CanBeNull]
    public string DocumentTypeUsed { get; } = documentTypeUsed;

    /// <summary>
    /// Allowed verification documents.
    /// </summary>
    public IReadOnlyList<AllowedDocumentInfoResponse> AllowedDocuments { get; } = allowedDocuments ?? new List<AllowedDocumentInfoResponse>();
}

/// <summary>
/// Allowed document info response.
/// </summary>
internal sealed class AllowedDocumentInfoResponse(
    string documentType = default,
    string documentTypeDescription = default,
    string initiateMethod = default)
{
    /// <summary>
    /// Allowed document type.
    /// </summary>
    public string DocumentType { get; } = documentType;

    /// <summary>
    /// Allowed document description.
    /// </summary>
    public string DocumentTypeDescription { get; } = documentTypeDescription;

    /// <summary>
    /// Allowed document initiate method.
    /// </summary>
    public string InitiateMethod { get; } = initiateMethod;
}
