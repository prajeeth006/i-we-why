using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Json;

internal interface IJsonResponseBodyExtender
{
    void AddForThisRequest(IJsonResponseBodyExtensionWriter writer);

    Task Extend(JObject body, JsonSerializer serializer, CancellationToken cancellationToken);
}

internal sealed class JsonResponseBodyExtender(IHttpContextAccessor httpContextAccessor) : IJsonResponseBodyExtender
{
    internal const string RequestKey = "Van:JsonResponseExtensionWriters";

    public void AddForThisRequest(IJsonResponseBodyExtensionWriter writer)
    {
        var list = GetListForCurrentRequest();
        list.Add(writer);
    }

    public async Task Extend(JObject body, JsonSerializer serializer, CancellationToken cancellationToken)
    {
        var list = GetListForCurrentRequest();

        foreach (var writer in list)
        {
            await writer.Write(body, serializer, cancellationToken);
        }
    }

    private List<IJsonResponseBodyExtensionWriter> GetListForCurrentRequest()
    {
        var items = httpContextAccessor.HttpContext?.Items ?? new Dictionary<object, object?>();

        if (!items.ContainsKey(RequestKey))
        {
            items.Add(RequestKey, new List<IJsonResponseBodyExtensionWriter>());
        }

        return items[RequestKey] as List<IJsonResponseBodyExtensionWriter> ?? new List<IJsonResponseBodyExtensionWriter>();
    }
}
