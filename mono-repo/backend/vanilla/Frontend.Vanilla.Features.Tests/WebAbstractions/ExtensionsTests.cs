using System.IO;
using System.Threading.Tasks;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Testing;
using Microsoft.AspNetCore.Http;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.WebAbstractions;

public class ExtensionsTests
{
    private DefaultHttpContext ctx;

    public ExtensionsTests()
    {
        ctx = new DefaultHttpContext();
        ctx.Response.Body = new MemoryStream();
    }

    [Fact]
    public async Task WriteResponseAsync_ShouldWriteBody()
    {
        // Act
        await ctx.WriteResponseAsync("memes/lol", "Hello there. General Kenobi!");

        ctx.Response.VerifyBody("memes/lol", "Hello there. General Kenobi!");
    }
}
