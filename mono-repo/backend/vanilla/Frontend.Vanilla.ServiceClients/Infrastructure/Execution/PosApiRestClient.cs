#nullable enable

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Diagnostics.Health;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure.Diagnostics;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace Frontend.Vanilla.ServiceClients.Infrastructure.Execution;

/// <summary>
/// Actual implementation of <see cref="IPosApiRestClient" />.
/// </summary>
internal sealed class PosApiRestClient(IRestClient restClient, IPosApiRestRequestFactory restRequestFactory, ITrafficHealthState trafficHealthState)
    : PosApiRestClientBase
{
    public static JsonSerializerSettings GetJsonSettings() => new ()
    {
        ContractResolver = new CamelCasePropertyNamesContractResolver(),
        CheckAdditionalContent = true,
        DateFormatHandling = DateFormatHandling.MicrosoftDateFormat,
        Converters = { new KeyValueDictionaryConverter() },
    };

    public static readonly IRestFormatter Formatter = new NewtonsoftJsonFormatter(GetJsonSettings());

    public override Task ExecuteAsync(ExecutionMode mode, PosApiRestRequest request)
        => ExecuteInternalAsync<object?>(mode, request, _ => null);

    public override Task<T> ExecuteAsync<T>(ExecutionMode mode, PosApiRestRequest request)
        => ExecuteInternalAsync(mode, request, r => r.Deserialize<T>(Formatter));

    private async Task<T> ExecuteInternalAsync<T>(ExecutionMode mode, PosApiRestRequest request, Func<RestResponse, T> deserializeResult)
    {
        Guard.NotNull(request, nameof(request));

        var restRequest = restRequestFactory.CreateRestRequest(request);
        var healthDetails = PosApiHealthCheck.GetResultDetails(restRequest, isFreshHealth: false);

        try
        {
            var restResponse = await restClient.ExecuteAsync(mode, restRequest);

            if (!restResponse.StatusCode.IsSucccess())
            {
                if (request is BettingApiRestRequestBase)
                {
                    throw CreateBettingException(restResponse);
                }

                throw CreateException(restResponse);
            }

            // Still PosAPI access is fine even if failed deserialization -> set success health state
            trafficHealthState.Set(HealthCheckResult.CreateSuccess(healthDetails));

            return deserializeResult(restResponse);
        }
        catch (Exception ex)
        {
            var paex = new PosApiException($"Failed processing request {restRequest} with headers: {restRequest.Headers}.", ex);

            if (ex is RestNetworkException || (ex as PosApiException)?.HttpCode.GetCategory() == HttpStatusCategory.ServerError)
                trafficHealthState.Set(HealthCheckResult.CreateFailed(paex, healthDetails));

            throw paex;
        }
    }

    private static PosApiException CreateException(RestResponse response)
    {
        PosApiError? dto = null;
        Exception? innerEx = null;

        try
        {
            dto = response.Deserialize<PosApiError>(Formatter);
        }
        catch (Exception ex)
        {
            innerEx = ex;
        }

        var details = dto != null
            ? $"PosApiCode: {dto.Code}, PosApiMessage: {dto.Message}"
            : "Also response contains invalid error details (see inner exception).";
        var msg =
            $"PosAPI response doesn't indicate success: {response}. Fix your request according to details from PosAPI or investigate it on their side. {details}";

        throw new PosApiException(msg, innerEx, response.StatusCode, dto?.Code ?? 0, dto?.Message, dto?.Values);
    }

    private sealed class PosApiError
    {
        public int Code { get; set; }
        public string? Message { get; set; }
        public Dictionary<string, string?>? Values { get; set; }
    }

    private static PosApiException CreateBettingException(RestResponse response)
    {
        BettingPosApiError? dto = null;
        Exception? innerEx = null;

        try
        {
            dto = response.Deserialize<BettingPosApiError>(Formatter);
        }
        catch (Exception ex)
        {
            innerEx = ex;
        }

        var details = dto != null
            ? $"Title: {dto.Title}, PosApiCode: {dto.Status}, PosApiMessage: {dto.Detail}, CorrelationId: {dto.CorrelationId} "
            : "Also response contains invalid error details (see inner exception).";
        var msg =
            $"PosAPI response doesn't indicate success: {response}. Fix your request according to details from PosAPI or investigate it on their side. {details}";

        throw new PosApiException(msg, innerEx, response.StatusCode, dto?.Status ?? 0, dto?.Detail);
    }

    private sealed class BettingPosApiError
    {
        public string? Title { get; set; }
        public int Status { get; set; }
        public string? Detail { get; set; }
        public string? CorrelationId { get; set; }
    }
}
