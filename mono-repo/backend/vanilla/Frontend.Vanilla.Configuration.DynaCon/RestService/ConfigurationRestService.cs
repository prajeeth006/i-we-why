using System;
using System.Collections.Generic;
using System.Net.Http;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.RestService;

/// <summary>
/// Encapsulates communication with DynCon API endpoints.
/// </summary>
internal interface IConfigurationRestService
{
    ConfigurationResponse GetCurrentConfiguration(bool maskSensitiveData = false);
    ConfigurationResponse GetConfiguration(long changesetId);
    IReadOnlyList<ConfigurationResponse> GetConfigurationChanges(long fromChangesetId);
    IReadOnlyList<long> GetValidatableChangesetIds();
    void PostValidChangesetFeedback(long changesetId, long? commitId);
    void PostInvalidChangesetFeedback(long changesetId, long? commitId, TrimmedRequiredString problemDescription, IEnumerable<ProblemDetail> problemDetails);
}

internal sealed class ConfigurationRestService(
    IConfigurationRestClient restClient,
    IConfigurationServiceUrls urls,
    DynaConEngineSettings settings,
    IEnvironment environment,
    ILogger<ConfigurationRestService> log)
    : IConfigurationRestService
{
    public ConfigurationResponse GetCurrentConfiguration(bool maskSensitiveData = false)
    {
        var url = new UriBuilder(urls.CurrentChangeset)
            .AddQueryParameters(("maskSensitiveData", maskSensitiveData.ToString()));
        var request = new RestRequest(url.GetHttpUri());

        return restClient.Execute<ConfigurationResponse>(request);
    }

    public ConfigurationResponse GetConfiguration(long changesetId)
        => restClient.Execute<ConfigurationResponse>(new RestRequest(urls.Changeset(changesetId)));

    public IReadOnlyList<ConfigurationResponse> GetConfigurationChanges(long fromChangesetId)
        => restClient.Execute<IReadOnlyList<ConfigurationResponse>>(new RestRequest(urls.ConfigurationChanges(fromChangesetId)));

    public IReadOnlyList<long> GetValidatableChangesetIds()
    {
        var dtos = restClient.Execute<IReadOnlyList<ValidatableChangesetResponse>>(new RestRequest(urls.ValidatableChangesets),
            settings.ValidatableChangesetsNetworkTimeout);

        return dtos.ConvertAll(d => d.ChangesetId);
    }

    public void PostValidChangesetFeedback(long changesetId, long? commitId)
        => PostFeedback(changesetId, commitId, isValid: true, problemDescription: null, problemDetails: null);

    public void PostInvalidChangesetFeedback(long changesetId, long? commitId, TrimmedRequiredString problemDescription, IEnumerable<ProblemDetail> problemDetails)
        => PostFeedback(changesetId, commitId, isValid: false, problemDescription, problemDetails.Enumerate());

    public void PostFeedback(long changesetId, long? commitId, bool isValid, TrimmedRequiredString? problemDescription, IReadOnlyList<ProblemDetail>? problemDetails)
    {
        HttpUri? url = null;

        try
        {
            url = urls.Feedback(changesetId, commitId);
            var dto = new FeedbackRequest(environment.MachineName, isValid, problemDetails, problemDescription?.Value);
            var request = new RestRequest(url, HttpMethod.Post) { Content = new RestRequestContent(dto, ConfigurationRestClient.Formatter) };
            restClient.Execute<VoidDto>(request);
        }
        catch (Exception ex)
        {
            log.LogError(ex,
                "Failed posting feedback {ChangesetId}, {IsValid}, {ProblemDescription} to DynaCon {Url}",
                changesetId,
                isValid,
                problemDescription,
                url);
        }
    }
}
