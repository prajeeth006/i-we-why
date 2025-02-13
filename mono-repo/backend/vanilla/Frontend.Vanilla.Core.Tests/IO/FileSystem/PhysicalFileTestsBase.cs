#nullable enable

using System;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;

namespace Frontend.Vanilla.Core.Tests.IO.FileSystem;

public abstract class PhysicalFileTestsBase : IDisposable
{
    internal RootedPath TestFile { get; set; }
    internal ExecutionMode Mode { get; set; }

    public PhysicalFileTestsBase()
    {
        TestFile = TempFile.Get(createFile: false, createParentDir: false);
        Mode = TestExecutionMode.Get();
    }

    public void Dispose()
    {
        TempFile.DeleteIfExists(TestFile);
    }
}
