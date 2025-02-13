using System.Buffers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Frontend.Vanilla.Features.Json;

internal sealed class VanillaMvcOptionsSetup(IOptions<MvcNewtonsoftJsonOptions> jsonOptions, ArrayPool<char> charPool, IJsonResponseBodyExtender jsonResponseBodyExtender)
    : IConfigureOptions<MvcOptions>
{
    private readonly MvcNewtonsoftJsonOptions jsonOptions = jsonOptions.Value;

    public void Configure(MvcOptions options)
    {
        options.OutputFormatters.Insert(0, new VanillaJsonAndStringOutputFormatter(jsonOptions.SerializerSettings, charPool, options, jsonResponseBodyExtender, null));
    }
}
