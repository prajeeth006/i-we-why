using System.Data.Common;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Core.System;

/// <summary>
/// Extension methods to add <see cref="ExecutionMode" /> support to <see cref="DbConnection" /> and <see cref="DbCommand" />.
/// </summary>
internal static class ExecutionModeExtensions
{
    public static Task OpenAsync(this DbConnection connection, ExecutionMode mode)
    {
        if (mode.AsyncCancellationToken != null)
            return connection.OpenAsync(mode.AsyncCancellationToken.Value);

        connection.Open();

        return Task.CompletedTask;
    }

    public static Task<object?> ExecuteScalarAsync(this DbCommand command, ExecutionMode mode)
        => mode.AsyncCancellationToken != null
            ? command.ExecuteScalarAsync(mode.AsyncCancellationToken.Value)
            : Task.FromResult(command.ExecuteScalar());

    public static Task<int> ExecuteNonQueryAsync(this DbCommand command, ExecutionMode mode)
        => mode.AsyncCancellationToken != null
            ? command.ExecuteNonQueryAsync(mode.AsyncCancellationToken.Value)
            : Task.FromResult(command.ExecuteNonQuery());
}
