using System;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Rest.Formatters;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Configuration.DynaCon.RestService;

/// <summary>
/// Generic class for executing REST requests to DynCon service.
/// </summary>
internal interface IConfigurationRestClient
{
    TDto Execute<TDto>(RestRequest request, TimeSpan? timeout = null)
        where TDto : class;
}

internal sealed class ConfigurationRestClient(DynaConEngineSettings settings, IEnvironment environment, IRestClient restClient) : IConfigurationRestClient
{
    public const string MachineNameHeader = "x-bwin-client-machine";
    public static readonly IRestFormatter Formatter = NewtonsoftJsonFormatter.Default;

    public TDto Execute<TDto>(RestRequest request, TimeSpan? timeout)
        where TDto : class
    {
        try
        {
            request.Headers.Add(HttpHeaders.Accept, ContentTypes.Json);
            request.Headers.Add(MachineNameHeader, environment.MachineName);
            request.Timeout = timeout ?? settings.NetworkTimeout;

            var response = restClient.Execute(request);

            if (!response.StatusCode.IsSucccess())
            {
                var msg = response.StatusCode.GetCategory() == HttpStatusCategory.ServerError
                    ? "Failed request on DynaCon side. Fix it there."
                    : "Failed request to DynaCon.";

                throw new Exception($"{msg} Response: {response}; Duration: {response.ExecutionDuration}; Body: {response.Content.DecodeToString()}");
            }

            return VoidDto.Singleton is TDto voidDto
                ? voidDto
                : response.Deserialize<TDto>(Formatter);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed request to DynaCon URL: {request.Url}", ex);
        }
    }
}
