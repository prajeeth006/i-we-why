using System;
using Microsoft.AspNetCore.Http;

namespace Frontend.Vanilla.Features.WebUtilities;

internal static class HttpStringExtensions
{
    public static bool IsRoot(this PathString path)
        => path == PathString.Empty || path.Value == "/";

    public static bool EqualsIgnoreCase(this PathString path, PathString other)
        => path.StartsWithIgnoreCase(other, out var remaining) && remaining.IsRoot();

    public static bool StartsWithIgnoreCase(this PathString path, PathString other, out PathString remaining)
        => path.StartsWithSegments(other, StringComparison.OrdinalIgnoreCase, out remaining);

    public static bool StartsWithIgnoreCase(this PathString path, PathString other)
        => path.StartsWithIgnoreCase(other, out var _);

    public static bool IsEmpty(this QueryString query)
        => (query.Value?.Length ?? 0) <= 1; // Always starts with '?'
}
