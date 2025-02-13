using System;
using System.Collections.Generic;

namespace Frontend.Vanilla.Testing.FluentAssertions;

internal static class FailureHelper
{
    public static Exception CreateError(params string[] sections)
    {
        return CreateError((IEnumerable<string>)sections);
    }

    public static Exception CreateError(IEnumerable<string> sections)
    {
        var msg = string.Join(Environment.NewLine + Environment.NewLine, sections);

        return new Exception(msg);
    }
}
