using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Features.WebIntegration.Core.ClientIP;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ErrorOr;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.WebIntegration.Core.DynaconAppBoot;

/// <summary>
/// Retrieves the Labels configuration from Dynacon using httpclient.
/// </summary>
internal interface IDynaconAppBootRestClientService
{
    LabelsDefaults GetLabelsDefaults();
    IReadOnlyList<IpSubnet> GetSubnets();
    Task LoadAsync(CancellationToken cancellationToken);
    Task ReloadAsync(CancellationToken cancellationToken);
}

internal sealed class DynaconAppBootRestClientService(
    DynaConEngineSettings dynaConEngineSettings,
    ClientIpHttpClient clientIpHttpClient,
    IFileSystem fileSystem,
    ILogger<IDynaconAppBootRestClientService> log) : IDynaconAppBootRestClientService
{
    private Uri ApiUrl => new UriBuilder(dynaConEngineSettings.Host)
    {
        Path = "/v1/configuration",
        Query = $"service=Labels%3A1&service={ClientIpResolutionAlgorithm.DynaConParameters.Service}%3A{ClientIpResolutionAlgorithm.DynaConParameters.Version}",
    }.Uri;

    private DynaconAppBootConfigurationResponse? cachedResult;

    public LabelsDefaults GetLabelsDefaults()
        => Resolve().Configuration.LabelsDefaults;

    public IReadOnlyList<IpSubnet> GetSubnets()
        => Resolve().Configuration.CompanyInternalNetwork.Subnets.Values.First().Convert();

    private DynaconAppBootConfigurationResponse Resolve()
    {
        return cachedResult ?? throw new VanillaBugException("Cached value has to be there, so investigate what removed it.");
    }

    public async Task LoadAsync(CancellationToken cancellationToken)
    {
        var result = await FetchFromDynaConAsync(cancellationToken);
        if (!result.IsError)
        {
            cachedResult = result.Value;
            await TryWriteToFallbackFileAsync(result.Value, cancellationToken);
            return;
        }

        result = await ReadFromFallbackFileAsync(cancellationToken);
        if (!result.IsError)
        {
            cachedResult = result.Value;
            return;
        }
        throw new VanillaBugException($"Failed to {nameof(DynaconAppBootRestClientService)}.{nameof(LoadAsync)} because neither dynacon nor a fallback file read were successful.");
    }

    public async Task ReloadAsync(CancellationToken cancellationToken)
    {
        var result = await FetchFromDynaConAsync(cancellationToken);
        if (!result.IsError)
        {
            cachedResult = result.Value;
            await TryWriteToFallbackFileAsync(result.Value, cancellationToken);
        }
    }

    private async Task<ErrorOr<DynaconAppBootConfigurationResponse>> FetchFromDynaConAsync(CancellationToken cancellationToken)
    {
        try
        {
            var response = await clientIpHttpClient.GetStringAsync(ApiUrl, cancellationToken);
            return Deserialize(response);
        }
        catch (Exception ex)
        {
            log.LogError(ex, $"{nameof(FetchFromDynaConAsync)} failed.");
            return Error.Failure(code: "Fetch failed.", ex.Message);
        }
    }

    private async Task<ErrorOr<DynaconAppBootConfigurationResponse>> ReadFromFallbackFileAsync(CancellationToken cancellationToken)
    {
        try
        {
            var content = await fileSystem.ReadFileTextAsync(dynaConEngineSettings.DynaconAppBootFallbackFile, cancellationToken);
            return Deserialize(content);
        }
        catch (Exception ex)
        {
            log.LogError(ex, $"{nameof(ReadFromFallbackFileAsync)} failed.");
            return Error.Failure(code: "Fallback file read failed.", ex.Message);
        }
    }

    private async Task TryWriteToFallbackFileAsync(DynaconAppBootConfigurationResponse response, CancellationToken cancellationToken)
    {
        try
        {
            await fileSystem.WriteFileAsync(dynaConEngineSettings.DynaconAppBootFallbackFile, JsonConvert.SerializeObject(response), cancellationToken);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed to write {content} into fallback {file}.", JsonConvert.SerializeObject(response), dynaConEngineSettings.DynaconAppBootFallbackFile);
        }
    }

    private ErrorOr<DynaconAppBootConfigurationResponse> Deserialize(string content)
    {
        try
        {
            var response = JsonConvert.DeserializeObject<DynaconAppBootConfigurationResponse>(content);
            if (response is not null)
            {
                return response;
            }
            return Error.Unexpected("Deserialization failed.");
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed to deserialize {content}.", content);
            return Error.Failure("Deserialization failed.", ex.Message);
        }
    }
}
