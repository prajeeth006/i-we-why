#nullable enable

using System;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Visitor;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class TestVisitorSettings
{
    public static VisitorSettings Get(
        Wrapper<string?>? cultureName = null,
        int? visitCount = null,
        UtcDateTime? sessionStartTime = null,
        UtcDateTime? previousSessionStartTime = null,
        string? lastSessionId = null)
        => new (
            TrimmedRequiredString.TryCreate(cultureName != null ? cultureName.Value : Guid.NewGuid().ToString()),
            visitCount ?? RandomGenerator.GetInt32(),
            sessionStartTime ?? TestTime.GetRandomUtc(),
            previousSessionStartTime ?? TestTime.GetRandomUtc());
}
