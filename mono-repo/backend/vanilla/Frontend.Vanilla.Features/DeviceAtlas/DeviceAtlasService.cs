using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.DeviceAtlas;

internal interface IDeviceAtlasService
{
    Task<(bool, IReadOnlyDictionary<string, string>)> GetAsync(ExecutionMode mode);

    /// <summary>Temporary added until dynacon providers are async.</summary>
    (bool, IReadOnlyDictionary<string, string>) Get();
}

internal sealed class DeviceAtlasService : IDeviceAtlasService
{
    public const string HttpClientName = "device-atlas-client";

    private readonly IHttpContextAccessor httpContextAccessor;
    private readonly IHttpClientFactory httpClientFactory;
    private readonly ILogger<DeviceAtlasService> logger;

    public DeviceAtlasService(IHttpContextAccessor httpContextAccessor, IHttpClientFactory httpClientFactory, ILogger<DeviceAtlasService> logger)
    {
        this.httpContextAccessor = httpContextAccessor;
        this.httpClientFactory = httpClientFactory;
        this.logger = logger;
    }

    public async Task<(bool, IReadOnlyDictionary<string, string>)> GetAsync(ExecutionMode mode)
    {
        try
        {
            var httpContext = httpContextAccessor.GetRequiredHttpContext();
            var client = httpClientFactory.CreateClient(HttpClientName);
            var response = await client.GetFromJsonAsync<IReadOnlyDictionary<string, string>>(string.Empty, mode.AsyncCancellationToken ?? httpContext.RequestAborted);
            return (true, response!);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to fetch device properties. Returning empty response.");
            return (false, EmptyDictionary<string, string>.Singleton);
        }
    }

    public (bool, IReadOnlyDictionary<string, string>) Get()
    {
        try
        {
            var client = httpClientFactory.CreateClient(HttpClientName);
            var request = new HttpRequestMessage(HttpMethod.Get, string.Empty);
            var response = client.Send(request, HttpCompletionOption.ResponseHeadersRead);
            using var responseStream = response.Content.ReadAsStream();
            var result = JsonSerializer.Deserialize<IReadOnlyDictionary<string, string>>(responseStream);
            var responseContent = result ?? EmptyDictionary<string, string>.Singleton;

            return (true, responseContent);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to fetch device properties. Returning empty response.");
            return (false, EmptyDictionary<string, string>.Singleton);
        }
    }
}
