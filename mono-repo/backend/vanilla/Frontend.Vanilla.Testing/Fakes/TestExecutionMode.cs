using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.Testing.Fakes;

internal static class TestExecutionMode
{
    /// <summary>
    ///     Create a fake using CTS in order to be unique each time.
    /// </summary>
    public static ExecutionMode Get()
    {
        return ExecutionMode.Async(TestCancellationToken.Get());
    }
}
