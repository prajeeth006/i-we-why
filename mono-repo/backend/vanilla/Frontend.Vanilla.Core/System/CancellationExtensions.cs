using System.Threading;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Core.System;

internal static class CancellationExtensions
{
    public static CancellationChangeToken GetChangeToken(this CancellationTokenSource source)
        => new CancellationChangeToken(source.Token);
}
