#nullable enable

using Frontend.Vanilla.Core.Collections;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Features.Tests.Fakes;

internal static class Extensions
{
    public static void SetQuery(this HttpRequest request, params (string Name, StringValues Value)[] parameters)
        => request.Query = new QueryCollection(parameters.ToDictionary());
}
