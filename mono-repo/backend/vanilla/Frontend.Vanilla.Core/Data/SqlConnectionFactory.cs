using System.Data.Common;
using Frontend.Vanilla.Core.System.Text;
using Microsoft.Data.SqlClient;

namespace Frontend.Vanilla.Core.Data;

/// <summary>
/// Abstraction of <see cref="SqlConnection" /> creation.
/// </summary>
internal interface ISqlConnectionFactory
{
    DbConnection Create(RequiredString connectionString);
}

internal sealed class SqlConnectionFactory : ISqlConnectionFactory
{
    public DbConnection Create(RequiredString connectionString)
        => new SqlConnection(connectionString);
}
