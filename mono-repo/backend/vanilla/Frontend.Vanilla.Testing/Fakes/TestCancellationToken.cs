using System.Threading;
using Xunit;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class TestCancellationToken
{
    /// <summary>
    ///     Create a fake using CTS in order to be unique each time.
    /// </summary>
    public static CancellationToken Get()
    {
        return TestContext.Current.CancellationToken;
    }
}
