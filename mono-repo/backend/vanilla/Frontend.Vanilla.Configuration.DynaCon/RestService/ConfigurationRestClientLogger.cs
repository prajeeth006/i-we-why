using System;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Time;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Configuration.DynaCon.RestService;

/// <summary>
/// Intercepts all calls to DynaCon and preserves them in <see cref="IHistoryLog{T}" /> for later diagnostics.
/// </summary>
internal class ConfigurationRestClientLogger(IConfigurationRestClient inner, IHistoryLog<RestServiceCallInfo> restServiceLog, IClock clock)
    : IConfigurationRestClient
{
    public TDto Execute<TDto>(RestRequest request, TimeSpan? timeout)
        where TDto : class
    {
        Exception? error = null;
        TDto? result = default;
        var time = clock.UtcNow;
        var getElapsed = clock.StartNewStopwatch();

        try
        {
            return result = inner.Execute<TDto>(request, timeout);
        }
        catch (Exception ex)
        {
            error = ex;

            throw;
        }
        finally
        {
            var requestContent = SerializeContent(request.Content?.Value, error);
            var responseContent = SerializeContent(result, error);
            var call = new RestServiceCallInfo(request.Url, request.Method, time, getElapsed(), requestContent, responseContent, error);
            restServiceLog.AddRange(new[] { call });
        }
    }

    private static string? SerializeContent(object? content, Exception? error)
    {
        try
        {
            var json = content != null ? JsonConvert.SerializeObject(content) : null;
            const int maxLength = 100; // Truncate to avoid storing too much diagnostics data unless there was an error

            return error == null && json?.Length > maxLength ? $"{json.Substring(0, maxLength)}... ({json.Length} chars total)" : json;
        }
        catch (Exception ex)
        {
            return $"(failed: {ex.GetMessageIncludingInner()})";
        }
    }
}
