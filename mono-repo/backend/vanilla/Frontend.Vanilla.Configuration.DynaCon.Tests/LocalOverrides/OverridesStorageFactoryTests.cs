using System;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.File;
using Frontend.Vanilla.Configuration.DynaCon.LocalOverrides.Session;
using Frontend.Vanilla.Configuration.DynaCon.Tests.Fakes;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Testing;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.LocalOverrides;

public class OverridesStorageFactoryTests
{
    [Theory]
    [InlineData(LocalOverridesMode.Disabled, typeof(DisabledOverridesStorage))]
    [InlineData(LocalOverridesMode.File, typeof(FileOverridesStorage))]
    [InlineData(LocalOverridesMode.Session, typeof(SessionOverridesStorage))]
    public void ShouldExpectCorrespondingStorage(LocalOverridesMode mode, Type expectedStorageType)
    {
        var settings = TestSettings.Get(b =>
        {
            b.LocalOverridesMode = mode;
            b.LocalOverridesFile = OperatingSystemRootedPath.GetRandom();
        });
        var fileSystem = Mock.Of<IFileSystem>();
        var sessionIdentifier = Mock.Of<IDynaConOverridesSessionIdentifier>();
        LambdaFactory<IOverridesStorage> target = new OverridesStorageFactory(settings, settings.TenantBlueprint, fileSystem, sessionIdentifier);

        // Act
        var storage = target.Create();

        storage.Should().BeOfType(expectedStorageType);
    }
}
