using FluentAssertions;
using Frontend.Vanilla.Core.IO.FileSystem;
using Frontend.Vanilla.Testing;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.IO.FileSystem;

public class AppDirectoryProviderTests
{
    [Fact]
    public void ShouldProvideDirectory()
    {
        string newTestPath = OperatingSystemRootedPath.GetRandom();

        IAppDirectoryProvider target = new AppDirectoryProvider(newTestPath);

        // Act
        target.Directory.Value.Should().Contain(newTestPath);
    }
}
