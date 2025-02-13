#nullable enable

using System.Collections.Generic;
using System.Globalization;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class TestCulture
{
    private static readonly IReadOnlyList<CultureInfo> Cultures = CultureInfo.GetCultures(CultureTypes.SpecificCultures);

    public static CultureInfo GetRandom()
        => Cultures[RandomGenerator.GetInt32(Cultures.Count)];

    public static void Set(string name)
        => CultureInfo.CurrentCulture = CultureInfo.CurrentUICulture = new CultureInfo(name);
}
