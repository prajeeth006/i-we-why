using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Features.Json;

/// <summary>
/// An interface used to extend <see cref="IActionResult"/> responses.
/// </summary>
public interface IJsonResponseBodyExtensionWriter
{
    /// <summary>
    /// Modifies JSON body of a response before it's sent.
    /// </summary>
    /// <param name="body">The payload to be modified.</param>
    /// <param name="serializer"><see cref="JsonSerializer"/> that was used to serialize the original response.</param>
    /// <param name="cancellationToken">The <see cref="CancellationToken"/>.</param>
    Task Write(JObject body, JsonSerializer serializer, CancellationToken cancellationToken);
}
