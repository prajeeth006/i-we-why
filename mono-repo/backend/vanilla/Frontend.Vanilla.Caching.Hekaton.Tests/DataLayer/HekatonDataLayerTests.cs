using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Caching.Hekaton.DataLayer;
using Frontend.Vanilla.Core.Data;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.Moq;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Moq;
using Moq.Protected;
using Xunit;
using SqlDbType = System.Data.SqlDbType;

namespace Frontend.Vanilla.Caching.Hekaton.Tests.DataLayer;

public class HekatonDataLayerTests : IDisposable
{
    private IHekatonDataLayer target;
    private Mock<ISqlConnectionFactory> sqlConnectionFactory;
    private TestLogger<HekatonDataLayer> log;

    private CancellationToken ct;
    private ExecutionMode mode;
    private byte[] testBytes;
    private Mock<DbConnection> connection;
    private Mock<DbCommand> command;

    public HekatonDataLayerTests()
    {
        var config = new Mock<IHekatonConfiguration>();
        config.SetupGet(c => c.HekatonConnectionString).Returns("testConnection");
        config.SetupGet(c => c.MaxKeyLength).Returns(256);
        sqlConnectionFactory = new Mock<ISqlConnectionFactory>();
        log = new TestLogger<HekatonDataLayer>();
        target = new HekatonDataLayer(config.Object, sqlConnectionFactory.Object, log);

        ct = TestCancellationToken.Get();
        mode = ExecutionMode.Async(ct);
        testBytes = Guid.NewGuid().ToByteArray();
        connection = new Mock<DbConnection>();
        command = new Mock<DbCommand>();

        sqlConnectionFactory.SetupWithAnyArgs(f => f.Create(null)).Returns(connection.Object);
        connection.Protected().Setup<DbCommand>("CreateDbCommand").Returns(command.Object);
        command.SetupAllProperties();
        command.Protected().SetupGet<DbParameterCollection>("DbParameterCollection").Returns(new SqlCommand().Parameters);
        command.SetupWithAnyArgs(c => c.ExecuteNonQueryAsync(default)).ReturnsAsync(0);
    }

    public void Dispose()
    {
        sqlConnectionFactory.VerifyWithAnyArgs(f => f.Create(null), Times.Once);
        sqlConnectionFactory.Verify(f => f.Create("testConnection"));

        connection.Protected().Verify("CreateDbCommand", Times.Once());
        connection.VerifyWithAnyArgs(c => c.OpenAsync(default), Times.Once);
        connection.Verify(c => c.OpenAsync(ct));
        connection.Protected().Verify("Dispose", Times.Once(), true, true);

        command.Object.CommandType.Should().Be(CommandType.StoredProcedure);
        command.Protected().Verify("Dispose", Times.Once(), true, true);
    }

    [Theory]
    [InlineData(true)]
    [InlineData(false)]
    public async Task GetAsync_ShouldGetCachedBytesFromDatabase(bool isCacheHit)
    {
        command.Setup(c => c.ExecuteScalarAsync(ct)).ReturnsAsync(isCacheHit ? testBytes : (object)DBNull.Value);

        var result = await target.GetAsync(mode, "test-key"); // Act

        result.Should().BeEquivalentTo(isCacheHit ? testBytes : null);
        command.Object.CommandText.Should().Be("GetCacheItem_v2");
        VerifyParameters(("@Key", SqlDbType.NVarChar, "test-key"));
    }

    [Theory, MemberData(nameof(LogWarningTestCases))]
    public Task GetAsync_ShouldLogWarning_IfKeyTooLong(int keyLength, bool expectedToLog)
        => RunLogWarningTest(keyLength, expectedToLog, k => target.GetAsync(mode, k));

    public static IEnumerable<object[]> ExpirationTestCases =>
        new List<object[]>
        {
            new object[] { CacheExpiration.CreateAbsolute(new UtcDateTime(2001, 2, 3)), new UtcDateTime(2001, 2, 3).Value, false, null },
            new object[] { CacheExpiration.CreateSliding(TimeSpan.FromSeconds(666.2)), null, true, 666 },
        };

    [Theory, MemberData(nameof(ExpirationTestCases))]
    internal async Task SetAsync_ShouldSetBytesToDatabase(CacheExpiration expiration, DateTime? expectedExpiration, bool expectedIsSliding, int? expectedSlidingSeconds)
    {
        await target.SetAsync(mode, "test-key", testBytes, expiration); // Act
        VerifySetProcedure("SetCacheItem_Short", expectedExpiration, expectedIsSliding, expectedSlidingSeconds);
    }

    public static IEnumerable<object[]> ProcedureAccordingToValueLengthTestCases => new[]
    {
        new object[] { 123, "SetCacheItem_Short" },
        new object[] { 8000, "SetCacheItem_Short" },
        new object[] { 8001, "SetCacheItem" },
        new object[] { 12_345, "SetCacheItem" },
    };

    [Theory, MemberData(nameof(ProcedureAccordingToValueLengthTestCases))]
    public async Task SetAsync_ShouldCallStoredProcedureAccordingToValueLength(int valueLength, string expectedProcedureName)
    {
        testBytes = new byte[valueLength];
        var expiration = CacheExpiration.CreateSliding(TimeSpan.FromSeconds(666));

        await target.SetAsync(mode, "test-key", testBytes, expiration); // Act

        VerifySetProcedure(expectedProcedureName, expectedExpiration: null, expectedIsSliding: true, expectedSlidingSeconds: 666);
    }

    private void VerifySetProcedure(string expectedProcedureName, DateTime? expectedExpiration, bool expectedIsSliding, int? expectedSlidingSeconds)
    {
        command.Object.CommandText.Should().Be(expectedProcedureName);
        command.Verify(c => c.ExecuteNonQueryAsync(ct));
        VerifyParameters(
            ("@Key", SqlDbType.NVarChar, "test-key"),
            ("@Value", SqlDbType.VarBinary, testBytes),
            ("@Expiration", SqlDbType.DateTime2, expectedExpiration),
            ("@IsSlidingExpiration", SqlDbType.Bit, expectedIsSliding),
            ("@SlidingIntervalInSeconds", SqlDbType.Int, expectedSlidingSeconds));
    }

    [Theory]
    [MemberData(nameof(LogWarningTestCases))]
    public Task SetAsync_ShouldLogWarning_IfKeyTooLong(int keyLength, bool expectedToLog)
        => RunLogWarningTest(keyLength, expectedToLog, k => target.SetAsync(mode, k, testBytes, CacheExpiration.CreateSliding(new TimeSpan(1))));

    [Fact]
    public async Task RemoveAsync_ShouldRemoveCacheItem()
    {
        await target.RemoveAsync(mode, "test-key"); // Act
        VerifyNonQueryProcedure("RemoveCacheItem_v2");
    }

    [Theory]
    [MemberData(nameof(LogWarningTestCases))]
    public Task RemoveAsync_ShouldLogWarning_IfKeyTooLong(int keyLength, bool expectedToLog)
        => RunLogWarningTest(keyLength, expectedToLog, k => target.RemoveAsync(mode, k));

    [Fact]
    public async Task RefreshAsync_ShouldRemoveCacheItem()
    {
        await target.RefreshAsync(mode, "test-key"); // Act
        VerifyNonQueryProcedure("RefreshCacheItem");
    }

    [Theory]
    [MemberData(nameof(LogWarningTestCases))]
    public async Task RefreshAsync_ShouldLogWarning_IfKeyTooLong(int keyLength, bool expectedToLog)
        => await RunLogWarningTest(keyLength, expectedToLog, k => target.RefreshAsync(mode, k));

    private void VerifyNonQueryProcedure(string expectedProcedureName)
    {
        command.Object.CommandText.Should().Be(expectedProcedureName);
        command.Verify(c => c.ExecuteNonQueryAsync(ct));
        VerifyParameters(("@Key", SqlDbType.NVarChar, "test-key"));
    }

    public static IEnumerable<object[]> LogWarningTestCases => new[]
    {
        new object[] { 12, false },
        new object[] { 256, false },
        new object[] { 257, true },
        new object[] { 1_234, true },
    };

    private async Task RunLogWarningTest(int keyLength, bool expectedToLog, Func<string, Task> act)
    {
        var key = new string('x', keyLength);

        await act(key);

        if (expectedToLog)
        {
            var logged = log.Logged.Single();
            logged.Level.Should().Be(LogLevel.Error);
            logged.Data.Should().Contain("key", key)
                .And.Contain("keyLength", key.Length)
                .And.Contain("maxKeyLength", 256);
            logged.Data["callerInfo"].Should().NotBeNull();
        }
        else
        {
            log.VerifyNothingLogged();
        }
    }

    private void VerifyParameters(params (string Name, SqlDbType DbType, object Value)[] expectedParameters)
    {
        command.Object.Parameters.Cast<SqlParameter>().Select(p => p.ParameterName)
            .Should().BeEquivalentTo(expectedParameters.Select(p => p.Name));

        foreach (var expected in expectedParameters)
        {
            var param = (SqlParameter)command.Object.Parameters[expected.Name];
            param.SqlDbType.Should().Be(expected.DbType);
            param.Value.Should().Be(expected.Value);
        }
    }
}
