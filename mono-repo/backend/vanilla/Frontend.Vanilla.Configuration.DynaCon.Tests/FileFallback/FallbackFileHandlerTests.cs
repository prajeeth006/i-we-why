using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Bwin.DynaCon.Api.Contracts.V1;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.FileFallback;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.IO;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Language.Flow;
using Newtonsoft.Json;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.FileFallback;

public sealed class FallbackFileHandlerTests
{
    private readonly Mock<IFileSystem> fileSystem;
    private readonly Mock<IFallbackFileDataHandler<FooData>> dataHandler;
    private readonly Mock<GetAppIdentifierHandler> getAppIdentifier;
    private readonly TestLogger<FallbackFile<FooData>> log;

    private readonly ExecutionMode mode;
    private readonly RootedPath testFile;
    private readonly FooData testData;

    public FallbackFileHandlerTests()
    {
        fileSystem = new Mock<IFileSystem> { DefaultValue = DefaultValue.Mock };
        dataHandler = new Mock<IFallbackFileDataHandler<FooData>>();
        getAppIdentifier = new Mock<GetAppIdentifierHandler>();
        log = new TestLogger<FallbackFile<FooData>>();

        mode = TestExecutionMode.Get();
        testFile = OperatingSystemRootedPath.GetRandom();
        testData = new FooData();

        dataHandler.SetupGet(h => h.Path).Returns(testFile);
        dataHandler.SetupGet(h => h.Parameters).Returns(new[] // Should be in different order than in TestJson
        {
            new DynaConParameter("context.label", "bwin.com"),
            new DynaConParameter("service", "Portal:20"),
            new DynaConParameter("service", "Vanilla:13"),
        });
        dataHandler.SetupWithAnyArgs(h => h.Deserialize(null)).Returns(testData);
        dataHandler.Setup(h => h.Serialize(testData)).Returns(GetTestFallbackDto());
        getAppIdentifier.Setup(g => g()).Returns("App123");
    }

    private FallbackFileHandlerBase<FooData> GetTarget()
        => new FallbackFileHandler<FooData>(dataHandler.Object, fileSystem.Object, getAppIdentifier.Object, log);

    public class FooData { }

    [Fact]
    public void Path_ShouldBeExposed()
        => GetTarget().Path.Value.Should().Be(testFile);

    [Fact]
    public void GetProperties_ShouldReturn_IfFile()
    {
        var fileProps = SetupFileProperties();

        // Act
        var result = GetTarget().GetProperties();

        result.Should().BeSameAs(fileProps);
    }

    [Fact]
    public void GetProperties_ShouldThrow_IfNotFound()
    {
        var target = GetTarget();

        Action act = () => target.GetProperties();

        act.Should().Throw<Exception>()
            .Which.Should().BeOfType<FileNotFoundException>()
            .Which.FileName.Should().Be(testFile);
    }

    private const string TestJson = @"{
            AppIdentifier: 'App123',
            Parameters: [
                { Name: 'service', Value: 'Vanilla:13' },
                { Name: 'service', Value: 'Portal:20' },
                { Name: 'context.label', Value: 'bwin.com' }
            ],
            ContextHierarchy: {
                Hierarchy: {
                    Product: {
                        LiveBetting: 'Sports',
                        Sports: null,
                        Casino: null
                    }
                }
            },
            Changeset: {
                ChangesetId: 123,
                ValidFrom: '2001-10-22T13:45:23Z',
                LastCommitId: 777,
                Configuration: {
                    'Vanilla.Foo': {
                        Bar: {
                            DataType: 'dummy-type',
                            Values: [{ Value: 'BWIN' }]
                        }
                    }
                }
            }
        }";

    [Fact]
    public async Task ReadAsync_ShouldReadDtoAndDeserialize()
    {
        SetupFileReadAsync().ReturnsAsync(TestJson);

        // Act
        var result = await GetTarget().ReadAsync(mode);

        result.Should().BeSameAs(testData);
        var dto = (FallbackDto)dataHandler.Invocations.Single(i => i.Method.Name == nameof(dataHandler.Object.Deserialize)).Arguments.Single();
        dto.Changeset?.ChangesetId.Should().Be(123);
        dto.Changeset?.ValidFrom.Should().Be(new DateTime(2001, 10, 22, 13, 45, 23, DateTimeKind.Utc));
        dto.Changeset?.Configuration.Keys.Should().BeEquivalentTo("Vanilla.Foo");
        dto.Changeset?.Configuration["Vanilla.Foo"]["Bar"].Values.Single().Value.Should().Be("BWIN");
        dto.ContextHierarchy?.Hierarchy.Keys.Should().BeEquivalentTo("Product");
        dto.ContextHierarchy?.Hierarchy["Product"].Should().Equal(new Dictionary<string, string>
        {
            { "LiveBetting", "Sports" },
            { "Sports", null },
            { "Casino", null },
        });
    }

    [Fact]
    public void ReadAsync_ShouldThrow_IfInvalidFile()
    {
        var fileEx = new Exception("File error");
        SetupFileReadAsync().ThrowsAsync(fileEx);

        RunReadExceptionTest( // Act
            e => e.Should().BeSameAs(fileEx));
    }

    [Theory]
    [InlineData("  ")]
    [InlineData("null")]
    [InlineData("[sdf gf {{ gfdb")]
    public void ReadAsync_ShouldThrow_IfInvalidJson(string json)
    {
        SetupFileReadAsync().ReturnsAsync(json);

        RunReadExceptionTest( // Act
            ex => ex.Should().BeAssignableTo<JsonException>());
    }

    [Fact]
    public void ReadConfiguration_ShouldThrowIfDeserializationFails()
    {
        var dataEx = new Exception("Deserialization error");
        SetupFileReadAsync().ReturnsAsync(TestJson);
        dataHandler.SetupWithAnyArgs(h => h.Deserialize(null)).Throws(dataEx);

        RunReadExceptionTest( // Act
            ex => ex.Should().BeSameAs(dataEx));
    }

    [Fact]
    public void ReadConfiguration_ShouldThrow_IfParametersNotEqual()
    {
        SetupFileReadAsync().ReturnsAsync(TestJson);
        dataHandler.SetupGet(h => h.Parameters).Returns(new[]
        {
            new DynaConParameter("service", "Vanilla:16"),
            new DynaConParameter("context.label", "partypoker.com"),
        });

        RunReadExceptionTest( // Act
            ex => ex.Message.Should().ContainAll(
                "'service'='Vanilla:16', 'context.label'='partypoker.com'",
                "'service'='Vanilla:13', 'service'='Portal:20', 'context.label'='bwin.com'"));
    }

    private void RunReadExceptionTest(Action<Exception> verifyEx)
    {
        Func<Task> act = () => GetTarget().ReadAsync(mode);

        var ex = act.Should().ThrowAsync<Exception>().Result;
        ex.Which.Message.Should().ContainAll($"'{testFile}'", nameof(FooData));
        verifyEx(ex.Which.InnerException);
    }

    private static FallbackDto GetTestFallbackDto() => new FallbackDto
    {
        Changeset = new ConfigurationResponse(
            123,
            new DateTime(2001, 10, 22, 13, 45, 23, DateTimeKind.Utc),
            new Dictionary<string, IReadOnlyDictionary<string, KeyConfiguration>>
            {
                ["Vanilla.Foo"] = new Dictionary<string, KeyConfiguration>
                {
                    ["Bar"] = new KeyConfiguration("company", new[] { new ValueConfiguration("BWIN") }),
                },
            },
            lastCommitId: 777),
        ContextHierarchy = new VariationHierarchyResponse(new Dictionary<string, IReadOnlyDictionary<string, string>>
        {
            ["Product"] = new Dictionary<string, string>
            {
                { "LiveBetting", "Sports" },
                { "Sports", null },
                { "Casino", null },
            },
        }),
    };

    [Fact]
    public void WriteConfiguration_ShouldWriteDto()
    {
        // Act
        GetTarget().Write(testData);

        var args = fileSystem.Invocations.Single().Arguments;
        args[0].Should().Be(testFile);
        args[1].Should().BeJson(@"{
                AppIdentifier: 'App123',
                Parameters: [
                    { Name: 'context.label', Value: 'bwin.com' },
                    { Name: 'service', Value: 'Portal:20' },
                    { Name: 'service', Value: 'Vanilla:13' }
                ],
                ContextHierarchy: {
                    Hierarchy: {
                        Product: {
                            LiveBetting: 'Sports',
                            Sports: null,
                            Casino: null
                        }
                    }
                },
                Changeset: {
                    ChangesetId: 123,
                    ValidFrom: '2001-10-22T13:45:23Z',
                    LastCommitId: 777,
                    Configuration: {
                        'Vanilla.Foo': {
                            Bar: {
                                CriticalityLevel: null,
                                DataType: 'company',
                                Values: [{
                                    Value: 'BWIN',
                                    Context: {},
                                    ValidFrom: null,
                                    ValidTo: null,
                                    Priority: 0
                                }]
                            }
                        }
                    }
                }
            }");
    }

    [Fact]
    public void WriteConfiguration_ShouldHandleExceptions()
        => RunWriteExceptionTest(expectedPreviousAppId: null);

    [Fact]
    public void WriteConfiguration_ShouldHandleExceptions_AndTryToGetPreviousAppIdBecauseOfConcurrency()
    {
        fileSystem.Setup(s => s.ReadFileText(testFile)).Returns(TestJson);
        RunWriteExceptionTest(expectedPreviousAppId: "App123");
    }

    private void RunWriteExceptionTest(string expectedPreviousAppId)
    {
        var ex = new Exception("Write error");
        fileSystem.SetupWithAnyArgs(f => f.WriteFile(null, null)).Throws(ex);
        getAppIdentifier.Setup(g => g()).Returns("Current456");

        // Act
        GetTarget().Write(testData);

        log.Logged.Single().Verify(
            LogLevel.Error,
            ex,
            ("dataType", nameof(FooData)),
            ("fallbackFile", testFile.Value),
            ("currentAppId", "Current456"),
            ("conflictingAppId", expectedPreviousAppId));
    }

    [Fact]
    public void ShouldAllowFileSystemAccessToMaxOneThread()
    {
        var beingAccessed = false;
        var accessedConcurrently = false;
        var callback = new Action(() =>
        {
            // First thread waits for long time, others should NOT be executed at the same time
            if (beingAccessed)
            {
                accessedConcurrently = true;

                return;
            }

            beingAccessed = true;
            Thread.Sleep(100);
            beingAccessed = false;
        });
        SetupFileReadAsync(callback).ReturnsAsync(TestJson);
        fileSystem.Setup(s => s.WriteFile(testFile, It.IsAny<string>())).Callback(callback);
        SetupFileProperties(callback);
        var target = GetTarget();

        // Act
        ConcurrencyTest.Run(12, i =>
        {
            switch (i % 3)
            {
                case 0:
                    target.ReadAsync(mode);

                    break;
                case 1:
                    target.Write(testData);

                    break;
                default:
                    target.GetProperties();

                    break;
            }
        });

        accessedConcurrently.Should().BeFalse();
    }

    [Fact]
    public void Constructor_ShouldThrow_IfNoPath()
    {
        dataHandler.SetupGet(h => h.Path).Returns(() => null);
        new Func<object>(GetTarget).Should().Throw(); // Act
    }

    private FileProperties SetupFileProperties(Action callback = null)
    {
        var props = TestFileSystemProperties.GetFile();
        fileSystem.Setup(s => s.GetFileProperties(testFile)).Callback(callback ?? (() => { })).Returns(props);

        return props;
    }

    private IReturnsThrows<IFileSystem, Task<string>> SetupFileReadAsync(Action callback = null)
        => fileSystem.Setup(s => s.ReadFileTextAsync(mode, testFile)).Callback(callback ?? (() => { }));
}
