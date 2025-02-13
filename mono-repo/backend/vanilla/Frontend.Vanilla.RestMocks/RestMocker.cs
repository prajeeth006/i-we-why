using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Json.Converters;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace Frontend.Vanilla.RestMocks;

/// <summary>
/// Components for providing REST request mocks.
/// </summary>
internal interface IRestMocker
{
    /// <summary>
    /// Gets REST request mocks.
    /// </summary>
    IEnumerable<RestMock> GetMocks();
}

/// <summary>
/// Gets REST request mocks. It also contains helper methods for constructing them.
/// </summary>
internal partial class RestMocker : IRestMocker
{
    private readonly JsonSerializer serializer;

    public RestMocker()
    {
        serializer = new JsonSerializer();
        serializer.Converters.Add(new KeyValueDictionaryConverter());
    }

    /// <summary>
    /// Adds mocks to this collection.
    /// </summary>
    public IEnumerable<RestMock> GetMocks()
        => GetCommonPosApiMocks().Concat(GetLoginMocks());

    /// <summary>
    /// Matches all HTTP requests incoming to this app.
    /// </summary>
    public MatchIncomingRequestToThisAppHandler AllIncomingRequestsToThisApp()
        => _ => true;

    /// <summary>
    /// Matches HTTP requests to this app to given URL.
    /// </summary>
    public MatchIncomingRequestToThisAppHandler IncomingRequestsToThisApp(string path = "", string query = "")
        => c => c?.BrowserRequest != null
                && c.BrowserRequest.Path.Value?.Contains(path) == true
                && c.BrowserRequest.QueryString.Value?.Contains(query) == true;

    /// <summary>
    /// Matches outgoing requests to PosAPI according to given URL.
    /// </summary>
    public MatchOutgoingRequestFromThisAppHandler OutgoingRequestsToPosApi(string pathAndQuerySubstr, HttpMethod method = null, string sessionToken = null)
        => c => IsGoingToPosApi(c.RestRequest)
                && c.RestRequest.Method == (method ?? HttpMethod.Get)
                && c.RestRequest.Url.PathAndQuery.Contains(pathAndQuerySubstr, StringComparison.OrdinalIgnoreCase)
                && (sessionToken == null || sessionToken == DictionaryExtensions.GetValue(c.RestRequest.Headers, "x-bwin-session-token"));

    /// <summary>
    /// Creates response with content from file embedded in given assembly.
    /// </summary>
    public GetMockedResponseHandler ResponseFromAssemblyFile(Assembly assembly, string fileName, HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        return StaticResponse(ReadAssemblyFile(assembly, fileName), statusCode);
    }

    private GetMockedResponseHandler ResponseFromThisAssembly(string fileName, HttpStatusCode statusCode = HttpStatusCode.OK)
        => ResponseFromAssemblyFile(typeof(RestMocker).Assembly, fileName, statusCode);

    public string ReadAssemblyFile(Assembly assembly, string fileName)
    {
        using (var resourceStream = assembly.GetManifestResourceStream($"{assembly.GetName().Name}.Responses.{fileName}"))
        {
            if (resourceStream == null)
                throw new Exception(
                    $"Unable to find file '{fileName}' embedded in assembly {assembly}."
                    + $" Existing resources are: {assembly.GetManifestResourceNames().Join(Environment.NewLine)}");

            return resourceStream.ReadAllBytes().DecodeToString();
        }
    }

    private string JsonSerialize(object obj)
    {
        using (var sw = new StringWriter())
        using (JsonWriter writer = new JsonTextWriter(sw))
        {
            serializer.Serialize(writer, obj);

            return sw.ToString();
        }
    }

    private T JsonDeserialize<T>(string json)
    {
        using (var r = new StringReader(json))
        using (JsonReader reader = new JsonTextReader(r))
        {
            return serializer.Deserialize<T>(reader);
        }
    }

    private T GetJsonPayload<T>(HttpRequest req)
        where T : class, new()
    {
        req.Body.Seek(0, SeekOrigin.Begin);

        return new JsonSerializer().Deserialize<T>(new JsonTextReader(new StreamReader(req.Body)));
    }

    private T GetJsonPayload<T>(RestRequest req)
        where T : class
    {
        if (req?.Content == null)
        {
            return null;
        }

        return JsonDeserialize<T>(req.Content.Bytes.DecodeToString());
    }

    /// <summary>
    /// Creates response based on static content.
    /// </summary>
    public GetMockedResponseHandler StaticResponse(string content, HttpStatusCode statusCode = HttpStatusCode.OK)
        => DynamicResponse(_ => content, statusCode);

    /// <summary>
    /// Creates response with dynamically constructed content.
    /// </summary>
    public GetMockedResponseHandler DynamicResponse(Func<RestMockDelegateContext, string> getContent, HttpStatusCode statusCode = HttpStatusCode.OK)
        => c => new RestResponse(c.RestRequest)
        {
            StatusCode = statusCode,
            Content = getContent(c).EncodeToBytes(),
        };

    internal static bool IsGoingToPosApi(RestRequest request)
        => (request.Url.AbsolutePath.StartsWith("/V3", StringComparison.OrdinalIgnoreCase)
            || request.Url.AbsolutePath.StartsWith("/V4", StringComparison.OrdinalIgnoreCase))
           && request.Headers.ContainsKey("x-bwin-accessId");
}
