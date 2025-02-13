using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.API;
using Frontend.Vanilla.Features.Json.ActionResults;
using Frontend.Vanilla.Features.Kyc;
using Frontend.Vanilla.Features.UserDocuments;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Kyc;
using Frontend.Vanilla.ServiceClients.Services.Kyc.Document;
using Frontend.Vanilla.ServiceClients.Services.Upload;
using Frontend.Vanilla.ServiceClients.Services.Upload.CustomerDocDetails;
using Microsoft.AspNetCore.Mvc;

namespace Frontend.SharedFeatures.Api.Features.UserDocuments;

[ApiController]
[Route("{culture}/api/[controller]")]
public sealed class UserDocumentsController : BaseController
{
    private readonly IPosApiUploadServiceInternal posApiUploadServiceInternal;
    private readonly IPosApiKycServiceInternal posApiKycServiceInternal;
    private readonly IUserDocumentsConfiguration userDocumentsConfiguration;
    private readonly IKycConfiguration kycConfiguration;
    private readonly ILogger logger;

    public UserDocumentsController(IServiceProvider provider, ILogger<UserDocumentsController> logger)
        : this(provider.GetRequiredService<IPosApiUploadServiceInternal>(),
            provider.GetRequiredService<IPosApiKycServiceInternal>(),
            provider.GetRequiredService<IUserDocumentsConfiguration>(),
            provider.GetRequiredService<IKycConfiguration>(),
            logger) { }

    internal UserDocumentsController(
        IPosApiUploadServiceInternal posApiUploadServiceInternal,
        IPosApiKycServiceInternal posApiKycServiceInternal,
        IUserDocumentsConfiguration userDocumentsConfiguration,
        IKycConfiguration kycConfiguration,
        ILogger logger)
    {
        this.posApiUploadServiceInternal = posApiUploadServiceInternal;
        this.posApiKycServiceInternal = posApiKycServiceInternal;
        this.userDocumentsConfiguration = userDocumentsConfiguration;
        this.kycConfiguration = kycConfiguration;
        this.logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var response = new CustomerDocDetailsResponse();

        if (!userDocumentsConfiguration.IsEnabled ||
            !userDocumentsConfiguration.DocumentVerificationStatus.Any() ||
            !kycConfiguration.UserKycStatus.Any())
        {
            return Ok(new CustomerDocDetailsResponse()); // Disabled; Missing configs
        }

        try
        {
            var mode = ExecutionMode.Async(cancellationToken);
            var useCases = kycConfiguration.UserKycStatus.Keys.Where(key => kycConfiguration.UserKycStatus[key].Evaluate()).ToList();

            try
            {
                if (!useCases.Any())
                {
                    response = await GetCustomerDocDetailsAsync(mode);
                }
            }
            catch (PosApiException ex)
            {
                if (ex.PosApiCode != -1) throw;

                return OkResult(response);
            }

            foreach (var useCase in useCases)
            {
                try
                {
                    var customerDocDetails = await GetCustomerDocDetailsAsync(mode, useCase);

                    response.DocumentVerificationStatus.AddRange(customerDocDetails.DocumentVerificationStatus);
                }
                catch (PosApiException ex)
                {
                    if (ex.PosApiCode != -1) throw;

                    var documentDetails = new List<DocumentDetails> { new (CustomerDocDetailsStatus.Required) };
                    response.DocumentVerificationStatus.Add(new (documentDetails, useCase));
                }
            }

            // Remove SOF documents if all use-cases are verified
            if (response.DocumentVerificationStatus.Count > 1 &&
                response.DocumentVerificationStatus.All(status => status.IsVerified))
            {
                response.DocumentVerificationStatus = response.DocumentVerificationStatus
                    .Where(d => d.UseCase != DocumentUseCase.Sof).ToList();
            }

            return OkResult(response);
        }
        catch (PosApiException sex)
        {
            logger.LogError(sex, "Error from PosAPI while calling GetCustomerDocDetails action: {Message}", sex.Message);

            return BadRequest(sex.ErrorMessage()).WithTechnicalErrorMessage(sex.ErrorCode());
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "General error while calling GetCustomerDocDetails action: {Message}", ex.Message);

            return BadRequest().WithTechnicalErrorMessage(scope: "userdocuments");
        }
    }

    private async Task<CustomerDocDetailsResponse> GetCustomerDocDetailsAsync(ExecutionMode mode, string useCase = DocumentUseCase.All)
    {
        var customerDocDetailsResponse = await posApiUploadServiceInternal.GetCustomerDocDetailsAsync(mode, useCase);
        var customerDocDetails = new CustomerDocDetailsResponse();

        if (customerDocDetailsResponse.DocumentVerificationStatus.All(document =>
                document.IsVerified && document.VerifiedTime.HasValue &&
                document.VerifiedTime.Value.Add(userDocumentsConfiguration.VerifiedDocumentsVisibilityTimespan) < DateTime.UtcNow))
        {
            // Hide verified documents if configured threshold has been reached
            return customerDocDetails;
        }

        foreach (var document in customerDocDetailsResponse.DocumentVerificationStatus.OrderByDescending(document => document.VerifiedTime))
        {
            var verificationStatus = new DocumentVerificationStatus
            {
                UseCase = document.UseCase,
                IsVerified = document.IsVerified,
            };

            foreach (var detail in document.DocumentDetails.OrderByDescending(detail => detail.DocumentStatusLastUpdated ?? detail.UploadedDate))
            {
                // Prevent document duplication / skip non-verified documents if overall status is verified
                if (verificationStatus.DocumentDetails.Any(d => d.DocumentType == detail.DocumentType) ||
                    (document.IsVerified && detail.DocumentStatus != CustomerDocDetailsStatus.Verified))
                {
                    continue;
                }

                // Get from Document Verification Options if DRIVING_LICENSE is used for IDENTITY or ADDRESS
                if (detail.DocumentType.Equals(DocumentType.DrivingLicense, StringComparison.InvariantCultureIgnoreCase) && !document.IsVerified)
                {
                    var documentVerificationOptions = await GetDocumentVerificationOptionsAsync(mode, useCase);

                    // Show Driving License document name if IDENTITY and ADDRESS have the same status
                    if (documentVerificationOptions.GroupBy(option => option.DocumentStatus).Count() == 1)
                    {
                        verificationStatus.DocumentDetails.Add(new (GetDocumentStatus(detail.DocumentStatus), DocumentType.DrivingLicense));
                    }
                    else
                    {
                        verificationStatus.DocumentDetails.AddRange(documentVerificationOptions.Where(option =>
                            verificationStatus.DocumentDetails.All(d => d.DocumentType != option.DocumentType)));
                    }
                }
                else
                {
                    verificationStatus.DocumentDetails.Add(new (GetDocumentStatus(detail.DocumentStatus), detail.DocumentType));
                }
            }

            // Group failed documents
            if (verificationStatus.DocumentDetails.Count > 1 &&
                verificationStatus.DocumentDetails.All(d => d.DocumentStatus == CustomerDocDetailsStatus.Failed))
            {
                verificationStatus.DocumentDetails =
                [
                    new DocumentDetails(verificationStatus.DocumentDetails.First().DocumentStatus, documentsCount: verificationStatus.DocumentDetails.Count),
                ];
            }
            else if (!verificationStatus.DocumentDetails.Any() ||
                     (verificationStatus.DocumentDetails.All(d => d.DocumentStatus == CustomerDocDetailsStatus.Verified) && !verificationStatus.IsVerified))
            {
                verificationStatus.DocumentDetails.Insert(0, new (CustomerDocDetailsStatus.Required));
            }

            customerDocDetails.DocumentVerificationStatus.Add(verificationStatus);
        }

        return customerDocDetails;
    }

    /// <summary>
    /// Mapping config: https://admin.dynacon.prod.env.works/services/198137/features/325151/keys/325153/valuematrix?_matchAncestors=true.
    /// </summary>
    /// <param name="documentStatus">Document status from the API response.</param>
    /// <returns>Document status according to DocumentVerificationStatus mapping.</returns>
    private string GetDocumentStatus(string documentStatus)
    {
        var status = userDocumentsConfiguration.DocumentVerificationStatus
            .FirstOrDefault(status => status.Value.Contains(documentStatus, StringComparer.InvariantCultureIgnoreCase))
            .Key;

        return status;
    }

    private async Task<IList<DocumentDetails>> GetDocumentVerificationOptionsAsync(ExecutionMode mode, string useCase)
    {
        var verificationOptions = await posApiKycServiceInternal.GetDocumentVerificationOptionsAsync(mode, useCase);

        // VerificationSteps array may contain null elements
        if (verificationOptions.VerificationSteps.FirstOrDefault() == null)
        {
            return new List<DocumentDetails>();
        }

        var documentVerificationOptions = verificationOptions.VerificationSteps
            .Select(step => new DocumentDetails(GetDocumentStatus(step.StepStatus), step.DocumentTypeUsed ?? step.StepName));

        return documentVerificationOptions.ToList();
    }
}
