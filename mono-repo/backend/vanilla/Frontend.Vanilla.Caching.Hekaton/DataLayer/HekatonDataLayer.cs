using System;
using System.Data;
using System.Data.Common;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Data;
using Frontend.Vanilla.Core.Diagnostics;
using Frontend.Vanilla.Core.System;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Caching.Hekaton.DataLayer;

/// <summary>
/// Encapsulates communication with Hekaton database.
/// </summary>
internal interface IHekatonDataLayer
{
    Task<byte[]?> GetAsync(ExecutionMode mode, string key);
    Task SetAsync(ExecutionMode mode, string key, byte[] value, CacheExpiration expiration);
    Task RemoveAsync(ExecutionMode mode, string key);
    Task RefreshAsync(ExecutionMode mode, string key);
}

internal sealed class HekatonDataLayer(IHekatonConfiguration config, ISqlConnectionFactory sqlConnectionFactory,  ILogger<HekatonDataLayer> log)
    : IHekatonDataLayer
{
    public Task<byte[]?> GetAsync(ExecutionMode mode, string key)
        => ExecuteStoredProcedureAsync(
            mode,
            procedureName: "GetCacheItem_v2",
            parameters: new[] { new SqlParameter("@Key", SqlDbType.NVarChar) { Value = VerifyKey(key) } },
            executeAsync: async command =>
            {
                var scalar = await command.ExecuteScalarAsync(mode).NoContextRestore();

                return !Convert.IsDBNull(scalar)
                    ? (byte[]?)scalar
                    : null;
            });

    public Task SetAsync(ExecutionMode mode, string key, byte[] value, CacheExpiration expiration)
        => ExecuteStoredProcedureAsync(
            mode,
            // There is a bug in currently used version of SQL Server when you have too big BLOB parameter for a Hekaton stored procedure
            // then the SQL engine spills this parameter out into the TEMPDB, issuing page latches as TEMPDB isn't a full in-memory technology
            // that's why we use faster method for smaller values
            procedureName: value.Length > 8000 ? "SetCacheItem" : "SetCacheItem_Short",
            parameters: new[]
            {
                new SqlParameter("@Key", SqlDbType.NVarChar) { Value = VerifyKey(key) },
                new SqlParameter("@Value", SqlDbType.VarBinary) { Value = value },
                new SqlParameter("@Expiration", SqlDbType.DateTime2) { Value = expiration.AbsoluteExpiration?.Value },
                new SqlParameter("@IsSlidingExpiration", SqlDbType.Bit) { Value = expiration.SlidingExpiration != null },
                new SqlParameter("@SlidingIntervalInSeconds", SqlDbType.Int) { Value = (int?)expiration.SlidingExpiration?.TotalSeconds },
            },
            executeAsync: cmd => cmd.ExecuteNonQueryAsync(mode));

    private const string RemoveStoredProcedure = "RemoveCacheItem_v2";

    public Task RemoveAsync(ExecutionMode mode, string key)
        => ExecuteNonQueryAsync(mode, key, RemoveStoredProcedure);

    public Task RefreshAsync(ExecutionMode mode, string key)
        => ExecuteNonQueryAsync(mode, key, procedureName: "RefreshCacheItem");

    private Task ExecuteNonQueryAsync(ExecutionMode mode, string key, string procedureName)
        => ExecuteStoredProcedureAsync(
            mode,
            procedureName,
            parameters: new[] { new SqlParameter("@Key", SqlDbType.NVarChar) { Value = VerifyKey(key) } },
            executeAsync: cmd => cmd.ExecuteNonQueryAsync(mode));

    private async Task<T> ExecuteStoredProcedureAsync<T>(ExecutionMode mode, string procedureName, SqlParameter[] parameters, Func<DbCommand, Task<T>> executeAsync)
    {
        using (var connection = sqlConnectionFactory.Create(config.HekatonConnectionString))
        using (var command = connection.CreateCommand())
        {
            command.CommandText = procedureName;
            command.CommandType = CommandType.StoredProcedure;
            command.Parameters.AddRange(parameters);

            await connection.OpenAsync(mode).NoContextRestore();

            return await executeAsync(command).NoContextRestore();
        }
    }

    private string VerifyKey(string key)
    {
        if (key.Length > config.MaxKeyLength)
            log.LogError(
                "Specified cache {key} with {keyLength} will be shortened to {maxKeyLength} to match the Hekaton DB requirement."
                + " Change your code so that keys don't exceed this limit (including the Vanilla app details) to prevent collisions and other inconsistencies. Called from: {callerInfo}",
                key,
                key.Length,
                config.MaxKeyLength,
                CallerInfo.Get());

        return key;
    }
}
