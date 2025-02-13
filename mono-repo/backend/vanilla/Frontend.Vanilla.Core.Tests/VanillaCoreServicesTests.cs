using System;
using Castle.DynamicProxy;
using FluentAssertions;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.IO.Compression;
using Frontend.Vanilla.Core.IO.FileSystem;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Reflection;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.Time;
using Frontend.Vanilla.Core.Time.Background;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.AbstractTests;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Core.Tests;

public sealed class VanillaCoreServicesTests
{
    private static readonly IServiceProvider Services = new ServiceCollection()
        .AddVanillaCore()
        .AddSingleton(new Mock<IConfiguration>().WithConnectionStrings().Object)
        .BuildServiceProvider();

    [Fact]
    public void ShouldAllowAddingServicesOnlyOnce()
        => AddServicesOnceTest.Run<IEnvironment>(s => s.AddVanillaCore());

    [Theory]
    // Common abstractions
    [InlineData(typeof(IEnvironment))]
    [InlineData(typeof(IThread))]
    [InlineData(typeof(ITask))]
    [InlineData(typeof(IExecutionContext))]

    // IO abstractions
    [InlineData(typeof(IFileSystem))]

    // Services
    [InlineData(typeof(IConfigurationEngine))]
    [InlineData(typeof(IRestClient))]
    [InlineData(typeof(ICurrentContextAccessor))]
    [InlineData(typeof(IClientIPResolver))]
    [InlineData(typeof(IInternalRequestEvaluator))]
    [InlineData(typeof(IGzipCompressor))]
    [InlineData(typeof(IBrotliCompressor))]
    [InlineData(typeof(IDeflateCompressor))]
    [InlineData(typeof(IStaticContextManager))]
    [InlineData(typeof(IMemoryCache))]
    [InlineData(typeof(ILabelIsolatedMemoryCache))]
    [InlineData(typeof(ITimerFactory))]
    [InlineData(typeof(ILogger<string>))] // Some logger
    [InlineData(typeof(IBackgroundWorker))]
    [InlineData(typeof(VanillaVersion))]
    public void ShouldResolve(Type type)
        => Services.GetRequiredService(type);

    [Fact]
    public void ShouldNotRegisterEnvironmentProviderBecauseWeDontKnowTheValues()
        => Services.GetService<IEnvironmentProvider>().Should().BeNull();

    [Theory]
    [InlineData(typeof(IAppDirectoryProvider))]
    [InlineData(typeof(IClientIPResolver))]
    [InlineData(typeof(IInternalRequestEvaluator))]
    [InlineData(typeof(ICurrentContextAccessor))]
    [InlineData(typeof(IConfigurationEngine))]
    public void ShouldAllowOverwriteDefault(Type type)
    {
        var mock = new ProxyGenerator().CreateInterfaceProxyWithoutTarget(type);
        var services = new ServiceCollection()
            .AddSingleton(type, mock) // Must be before the module in order to verify TryAdd()
            .AddVanillaCore()
            .BuildServiceProvider();

        // Act
        services.GetService(type).Should().BeSameAs(mock);
    }
}
