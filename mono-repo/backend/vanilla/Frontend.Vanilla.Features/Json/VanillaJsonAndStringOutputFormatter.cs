using System.Buffers;
using System.Text;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Formatters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Json;

internal sealed class VanillaJsonAndStringOutputFormatter(
    JsonSerializerSettings serializerSettings,
    ArrayPool<char> charPool,
    MvcOptions mvcOptions,
    IJsonResponseBodyExtender jsonResponseBodyExtender,
    MvcNewtonsoftJsonOptions? jsonOptions)
    : NewtonsoftJsonOutputFormatter(serializerSettings, charPool, mvcOptions, jsonOptions)
{
    public override async Task WriteResponseBodyAsync(OutputFormatterWriteContext context, Encoding selectedEncoding)
    {
        Guard.NotNull(context, nameof(context));
        Guard.NotNull(selectedEncoding, nameof(selectedEncoding));

        var jsonSerializer = CreateJsonSerializer(context);

        switch (context.Object)
        {
            case null:
                await WriteResponseAsync(context, selectedEncoding, null);

                break;
            case string content:
                await WriteResponseAsync(context, selectedEncoding, content);

                break;
            default:
            {
                var json = JObject.FromObject(context.Object, jsonSerializer);
                await jsonResponseBodyExtender.Extend(json, jsonSerializer, context.HttpContext.RequestAborted);
                await WriteResponseAsync(context, selectedEncoding, json.ToString());

                break;
            }
        }
    }

    private async Task WriteResponseAsync(OutputFormatterWriteContext context, Encoding selectedEncoding, string? content)
    {
        var response = context.HttpContext.Response;
        var responseStream = response.Body;

        await using var writer = context.WriterFactory(responseStream, selectedEncoding);
        await writer.WriteAsync(content);
    }
}
