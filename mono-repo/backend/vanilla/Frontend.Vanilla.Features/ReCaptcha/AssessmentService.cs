#nullable disable

using System;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.ServiceClients.Infrastructure.Execution;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.ReCaptcha;

/// <summary>
/// Send/Annotate assessments to reCAPTCHA Enterprise API.
/// </summary>
internal interface IAssessmentService
{
    Task<ReCaptchaAssessment> CreateAssessmentAsync(RecaptchaEvent recaptchaEvent, CancellationToken cancellationToken);
    Task AnnotateAssessmentAsync(string assessmentName, AssessmentAnnotations annotation, CancellationToken cancellationToken);
}

internal sealed class AssessmentService(IReCaptchaConfiguration config, IRestClient restClient, ILogger<AssessmentService> log)
    : IAssessmentService
{
    private const string NetworkError =
        "Failed to connect to RecaptchaEnterprise service most likely because Google servers are inaccessible. Ask network team to fix it e.g. open ports on firewall.";

    public async Task<ReCaptchaAssessment> CreateAssessmentAsync(RecaptchaEvent recaptchaEvent, CancellationToken cancellationToken)
    {
        var uri = new HttpUri($"{config.ApiUrl}/projects/{config.EnterpriseProjectId}/assessments?key={config.EnterpriseSecretKey}");
        var reCaptchaEnterpriseRequest = new ReCaptchaEnterpriseRequest(recaptchaEvent);

        var request = new RestRequest(uri, HttpMethod.Post)
        {
            Content = new RestRequestContent(reCaptchaEnterpriseRequest, PosApiRestClient.Formatter),
        };

        try
        {
            var assessmentData = await GoogleProjectAssessmentAsync(request, cancellationToken);

            return assessmentData.Response;
        }
        catch (RestNetworkException ex)
        {
            log.LogError(ex, NetworkError);

            throw new Exception(NetworkError, ex);
        }
        catch (Exception ex)
        {
            var errorMessage =
                $"RecaptchaEnterprise failed to create verification request to URL: {request.Url.HideSensitiveQueryParamValue("key")} with parameters {request.Content?.Bytes.DecodeToString()}.";
            log.LogError(errorMessage, ex);

            throw new Exception(errorMessage, ex);
        }
    }

    public async Task AnnotateAssessmentAsync(string assessmentName, AssessmentAnnotations annotation, CancellationToken cancellationToken)
    {
        var request = new RestRequest(new HttpUri($"{config.ApiUrl}/{assessmentName}:annotate?key={config.EnterpriseSecretKey}"), HttpMethod.Post)
        {
            Content = new RestRequestContent(new AnnotationRequest(annotation), PosApiRestClient.Formatter),
        };

        try
        {
            await restClient.ExecuteAsync(request, cancellationToken);
        }
        catch (RestNetworkException ex)
        {
            throw new Exception(NetworkError, ex);
        }
        catch (Exception ex)
        {
            var errorMessage =
                $"Failed to annotate RecaptchaEnterprise assessment '{assessmentName}' as '{annotation}'.  URL: {request.Url.HideSensitiveQueryParamValue("key")} with parameters {request.Content?.Bytes.DecodeToString()}.";
            log.LogError(errorMessage, ex);

            throw new Exception(errorMessage, ex);
        }
    }

    private async Task<ReCaptchaEnterpriseData> GoogleProjectAssessmentAsync(RestRequest request, CancellationToken cancellationToken)
    {
        var restResponse = await restClient.ExecuteAsync(request, cancellationToken);

        if (restResponse.StatusCode != HttpStatusCode.OK)
        {
            throw new Exception($"RecaptchaEnterprise request to Google with URL: {request.Url.HideSensitiveQueryParamValue("key")} failed with: {restResponse.Content.DecodeToString()}");
        }

        var dto = restResponse.Deserialize<ReCaptchaAssessment>(NewtonsoftJsonFormatter.Default);

        return new ReCaptchaEnterpriseData(restResponse, dto);
    }
}

internal class AnnotationRequest(AssessmentAnnotations annotation)
{
    public AssessmentAnnotations Annotation { get; set; } = annotation;
}
