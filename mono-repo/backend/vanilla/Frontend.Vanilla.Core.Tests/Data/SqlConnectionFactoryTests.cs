using FluentAssertions;
using Frontend.Vanilla.Core.Data;
using Microsoft.Data.SqlClient;
using Xunit;

namespace Frontend.Vanilla.Core.Tests.Data;

public class SqlConnectionFactoryTests
{
    [Fact]
    public void ShouldCreateConnection()
    {
        const string connectionStr = "Persist Security Info=False;Integrated Security=true;Initial Catalog=Northwind;server=(local)";
        ISqlConnectionFactory target = new SqlConnectionFactory();

        var connection = target.Create(connectionStr); // Act

        connection.Should().BeOfType<SqlConnection>()
            .Which.ConnectionString.Should().Be(connectionStr);
    }
}
