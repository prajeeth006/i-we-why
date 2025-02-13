using System;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class TestTime
{
    public static DateTime GetRandom(DateTimeKind kind = default)
    {
        return new DateTime(
            RandomGenerator.GetInt32(400) + 1900,
            RandomGenerator.GetInt32(12) + 1,
            RandomGenerator.GetInt32(28) + 1,
            RandomGenerator.GetInt32(24),
            RandomGenerator.GetInt32(60),
            RandomGenerator.GetInt32(60),
            kind);
    }

    public static UtcDateTime GetRandomUtc()
    {
        return new UtcDateTime(GetRandom(DateTimeKind.Utc));
    }
}
