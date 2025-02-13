using System.Data;
using Microsoft.Data.SqlClient;

namespace Frontend.DeviceAtlas.Api.Infrastructure.Database;

internal interface IDbConnectionProvider
{
    IDbConnection Get();
}

internal sealed class DbConnectionProvider : IDbConnectionProvider
{
    private readonly IDbConnectionFactory connectionFactory;

    public DbConnectionProvider(IDbConnectionFactory connectionFactory)
    {
        this.connectionFactory = connectionFactory;
    }
    public IDbConnection Get()
    {
        return new SqlConnection(connectionFactory.ConnectionString);
    }
}
