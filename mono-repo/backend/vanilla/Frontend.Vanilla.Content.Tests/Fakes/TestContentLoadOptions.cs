using System;

namespace Frontend.Vanilla.Content.Tests.Fakes;

internal static class TestContentLoadOptions
{
    private static int prefetchDepthCounter = new Random().Next();

    public static ContentLoadOptions Get(
        DslEvaluation dslEvaluation = default,
        bool requireTranslation = false,
        bool includeTranslation = false,
        uint? prefetchDepth = null,
        bool bypassCache = false)
        => new ()
        {
            DslEvaluation = dslEvaluation,
            PrefetchDepth = prefetchDepth ?? (uint)prefetchDepthCounter++, // It implements Equals() -> set some property to make it unique
            RequireTranslation = requireTranslation,
            IncludeTranslation = includeTranslation,
            BypassCache = bypassCache,
        };
}
